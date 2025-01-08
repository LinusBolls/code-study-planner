import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

import { AppDataSource } from "@/backend/datasource";
import { Semester } from "@/backend/entities/semester.entity";
import { SemesterModule } from "@/backend/entities/semesterModule.entity";
import { getUser } from "@/backend/getUser";

const byIndex = (a: SemesterModule, b: SemesterModule) => a.index - b.index;

const toModule = (module: SemesterModule) => ({ moduleId: module.module.lpId });

export async function GET(req: NextRequest) {
  const user = await getUser(req);

  if (!user) {
    return NextResponse.json({}, { status: 401 });
  }

  const semesterRepository = AppDataSource.getRepository(Semester);

  const semesters = await semesterRepository.find({
    where: {
      studyPlan: {
        user: {
          id: user.id,
        },
      },
    },
    relations: ["semesterModules", "semesterModules.module"],
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
            .filter((module) => module.assessmentType === "earlyAssessments")
            .sort(byIndex)
            .map(toModule),
          standardAssessments: semester.semesterModules
            .filter((module) => module.assessmentType === "standardAssessments")
            .sort(byIndex)
            .map(toModule),
          alternativeAssessments: semester.semesterModules
            .filter(
              (module) => module.assessmentType === "alternativeAssessments",
            )
            .sort(byIndex)
            .map(toModule),
          reassessments: semester.semesterModules
            .filter((module) => module.assessmentType === "reassessments")
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

export async function DELETE(req: NextRequest) {
  const user = await getUser(req);

  if (!user) {
    return NextResponse.json({}, { status: 401 });
  }

  const semesterRepository = AppDataSource.getRepository(Semester);

  const deleteRes = await semesterRepository.delete({
    studyPlan: {
      user: {
        id: user.id,
      },
    },
  });
  if (deleteRes.affected === 0) {
    return NextResponse.json({}, { status: 404 });
  }
  return NextResponse.json({}, { status: 200 });
}
