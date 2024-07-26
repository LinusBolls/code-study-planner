import { AppDataSource } from "@/backend/datasource";
import { StudyPlanDTO } from "@/backend/dtos/study-plan.dto";
import { Semester } from "@/backend/entities/semester.entity";
import { SemesterModule } from "@/backend/entities/semesterModule.entity";
import { StudyPlan, StudyPlanScope } from "@/backend/entities/studyPlan.entity";
import {
  CollaboratorRole,
  StudyPlanCollaborator,
} from "@/backend/entities/studyPlanCollaborator.entity";
import { getUser } from "@/backend/getUser";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

const byIndex = (a: SemesterModule, b: SemesterModule) => a.index - b.index;

const toModule = (module: SemesterModule) => ({ moduleId: module.module.lpId });

export async function GET(req: NextRequest) {
  const user = await getUser(req);

  if (!user) {
    return NextResponse.json({}, { status: 401 });
  }
  const collaboratorRepository = AppDataSource.getRepository(
    StudyPlanCollaborator,
  );

  const studyPlanCollaborator = await collaboratorRepository.findOne({
    where: {
      user: {
        id: user.id,
      },
    },
  });

  if (!studyPlanCollaborator) {
    return NextResponse.json({}, { status: 401 });
  }

  const semesterRepository = AppDataSource.getRepository(Semester);

  const semesters = await semesterRepository.find({
    where: {
      studyPlan: {
        studyPlanCollaborator: {
          hasAccepted: true,
          role: CollaboratorRole.Owner,
          id: studyPlanCollaborator.id,
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

  const studyPlan: StudyPlanDTO = {
    scope: StudyPlanScope.Private,
    studyPlanCollaborator: [],
    semesters: mappedSemesters,
  };

  const res = NextResponse.json(studyPlan);
  return res;
}
