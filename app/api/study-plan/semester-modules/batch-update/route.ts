import { AppDataSource, connectToDatabase } from "@/backend/datasource";
import { Module } from "@/backend/entities/module.entity";
import { Semester } from "@/backend/entities/semester.entity";
import { SemesterModule } from "@/backend/entities/semesterModule.entity";
import { getUser } from "@/backend/getUser";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * note: both `semesterId` and `moduleId` are learning platform ids, not the ids in our database
 */
export async function PUT(req: NextRequest) {
  const user = await getUser(req);

  if (!user) {
    return NextResponse.json({}, { status: 401 });
  }

  const moduleSchema = z.object({
    moduleId: z.string(),
  });
  const semesterSchema = z.object({
    earlyAssessments: z.array(moduleSchema),
    standartAssessments: z.array(moduleSchema),
    alternativeAssessments: z.array(moduleSchema),
    reassessments: z.array(moduleSchema),
  });
  const bodySchema = z.record(semesterSchema);

  let body: z.infer<typeof bodySchema>;

  try {
    body = bodySchema.parse(await req.json());
  } catch (err) {
    return NextResponse.json({}, { status: 400 });
  }

  await connectToDatabase();

  console.time("batch-update");

  const semesterIds = Object.keys(body);

  const semestersCount = await AppDataSource.getRepository(Semester)
    .createQueryBuilder("semester")
    .where(
      "semester.id IN (:...semesterIds) and semester.studyPlanId = :studyPlanId",
      {
        semesterIds,
        studyPlanId: user.studyPlanId,
      }
    )
    .getCount();

  if (semestersCount !== semesterIds.length) {
    return NextResponse.json(
      {
        message: "one or more semesters do not exist",
      },
      { status: 400 }
    );
  }

  await AppDataSource.transaction(async (transaction) => {
    const idsToDelete = await transaction
      .getRepository(SemesterModule)
      .createQueryBuilder("semesterModule")
      .leftJoin("semesterModule.semester", "semester")
      .select("semesterModule.id")
      .where(
        "semester.studyPlanId = :studyPlanId AND semesterModule.semesterId IN (:...semesterIds)",
        {
          studyPlanId: user.studyPlanId,
          semesterIds,
        }
      )
      .getMany();

    if (idsToDelete.length) {
      await transaction
        .getRepository(SemesterModule)
        .createQueryBuilder()
        .delete()
        .where("id IN (:...ids)", { ids: idsToDelete.map((sm) => sm.id) })
        .execute();
    }

    const moduleIds = Object.values(body).flatMap((semester) =>
      Object.values(semester).flatMap((modules) =>
        modules.map((i) => i.moduleId)
      )
    );

    if (moduleIds.length) {
      const knownModules = await transaction
        .getRepository(Module)
        .createQueryBuilder("module")
        .select()
        .where("module.lpId IN (:...moduleIds)", {
          moduleIds,
        })
        .getMany();

      const unknownModules = moduleIds.filter(
        (moduleId) => !knownModules.some((module) => module.lpId === moduleId)
      );

      for (const unknownModuleId of unknownModules) {
        const newModule = new Module();
        newModule.lpId = unknownModuleId;
        newModule.proficiency = 0;
        newModule.possiblyOutdated = true;
        await transaction.getRepository(Module).save(newModule);
      }

      const knownModules2 = await transaction
        .getRepository(Module)
        .createQueryBuilder("module")
        .select()
        .where("module.lpId IN (:...moduleIds)", {
          moduleIds,
        })
        .getMany();

      for (const [semesterId, semester] of Object.entries(body)) {
        for (const [categoryId, category] of Object.entries(semester)) {
          for (const [idx, semesterModule] of category.entries()) {
            const newModule = new SemesterModule();

            newModule.module = knownModules2.find(
              (i) => i.lpId === semesterModule.moduleId
            )!;
            newModule.semesterId = semesterId;
            newModule.assessmentType = categoryId;
            newModule.index = idx;

            await transaction.getRepository(SemesterModule).save(newModule);
          }
        }
      }
    }
  });
  console.timeEnd("batch-update");

  const res = NextResponse.json({});

  return res;
}
