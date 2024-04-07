import { AppDataSource, connectToDatabase } from "@/backend/datasource";
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
    .where("semester.id IN (:...semesterIds) and semester.userId = :userId", {
      semesterIds,
      userId: user.id,
    })
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
    await transaction
      .getRepository(SemesterModule)
      .createQueryBuilder("semesterModule")
      .where(
        "semesterModule.semesterId IN (:...semesterIds) and semester.userId = :userId",
        {
          semesterIds,
          userId: user.id,
        }
      )
      .delete()
      .execute();

    for (const [semesterId, semester] of Object.entries(body)) {
      for (const [categoryId, category] of Object.entries(semester)) {
        for (const [idx, semesterModule] of category.entries()) {
          const newModule = new SemesterModule();

          newModule.moduleId = semesterModule.moduleId;
          newModule.semesterId = semesterId;
          newModule.assessmentType = categoryId;
          newModule.index = idx;

          await transaction.getRepository(SemesterModule).save(newModule);
        }
      }
    }
  });
  console.timeEnd("batch-update");

  const res = NextResponse.json({});

  return res;
}
