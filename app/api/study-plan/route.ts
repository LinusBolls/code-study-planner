import { AppDataSource } from "@/backend/datasource";
import { Semester } from "@/backend/entities/semester.entity";
import { SemesterModule } from "@/backend/entities/semesterModule.entity";
import { getUser } from "@/backend/getUser";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

const byIndex = (a: SemesterModule, b: SemesterModule) => a.index - b.index;

const toModule = (module: SemesterModule) => ({ moduleId: module.moduleId });

export async function GET(req: NextRequest) {
  const user = await getUser(req);

  if (!user) {
    return NextResponse.json({}, { status: 401 });
  }

  const semesterRepository = AppDataSource.getRepository(Semester);

  const semesters = await semesterRepository.find({
    where: {
      userId: user.id,
    },
    relations: {
      semesterModules: true,
    },
  });

  const mappedSemesters = semesters
    .toSorted((a, b) => dayjs(a.startDate).unix() - dayjs(b.startDate).unix())
    .map((semester) => {
      return {
        id: semester.id,
        lpId: semester.lpId,
        startDate: semester.startDate,
        modules: {
          earlyAssessments: semester.semesterModules
            .filter((module) => module.assessmentType === "earlyAssessment")
            .sort(byIndex)
            .map(toModule),
          standartAssessments: semester.semesterModules
            .filter((module) => module.assessmentType === "standartAssessment")
            .sort(byIndex)
            .map(toModule),
          alternativeAssessments: semester.semesterModules
            .filter(
              (module) => module.assessmentType === "alternativeAssessment"
            )
            .sort(byIndex)
            .map(toModule),
          reassessments: semester.semesterModules
            .filter((module) => module.assessmentType === "reassessment")
            .sort(byIndex)
            .map(toModule),
        },
      };
    });

  const res = NextResponse.json({
    semesters: mappedSemesters,
  });
  return res;
}
