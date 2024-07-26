import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

import { SemesterDTO } from "@/backend/dtos/semester.dto";
import {
  StudyPlanDTO,
  StudyPlanUpdateScopeDTO,
} from "@/backend/dtos/study-plan.dto";
import { Semester } from "@/backend/entities/semester.entity";
import { SemesterModule } from "@/backend/entities/semesterModule.entity";
import { CollaboratorRole } from "@/backend/entities/studyPlanCollaborator.entity";
import { getSemesterByStudyPlanId } from "@/backend/queries/semester.query";
import { getCollaborator } from "@/backend/queries/study-plan-collaborator.query";
import {
  getStudyPlanByCollaboratorId,
  updateStudyPlanScopeByCollabId,
} from "@/backend/queries/study-plan.query";

const byIndex = (a: SemesterModule, b: SemesterModule) => a.index - b.index;

const toModule = (module: SemesterModule) => ({ moduleId: module.module.lpId });

const mapSemster = (semesters: Semester[]): SemesterDTO[] => {
  return semesters
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
};

export async function GET(req: NextRequest) {
  const studyPlanCollaborator = await getCollaborator(req);

  if (!studyPlanCollaborator || studyPlanCollaborator.length === 0) {
    return NextResponse.json({}, { status: 401 });
  }

  // TODO: Another todo, we are always taking the studyplanner with index 0, possibly needs be some kind of use preference or last viewed or something
  const currentCollab = studyPlanCollaborator[0];

  const currentStudyPlan = await getStudyPlanByCollaboratorId(currentCollab.id);

  if (!currentStudyPlan) {
    return NextResponse.json({}, { status: 401 });
  }

  /*
    TODO: maybe add error if list is empty or return something currently if find function errors returns empty list
    Prev. on error it would automatically return response 500 rn this wouldnt happen 
    */
  const semesters = await getSemesterByStudyPlanId(currentStudyPlan.id);

  const mappedSemesters = mapSemster(semesters);

  const studyPlan: StudyPlanDTO = {
    scope: currentStudyPlan.scope,
    studyPlanCollaborator: currentStudyPlan.studyPlanCollaborator,
    semesters: mappedSemesters,
  };

  return NextResponse.json(studyPlan);
}

export async function PUT(req: NextRequest) {
  const studyPlanCollaborator = await getCollaborator(req);

  if (
    !studyPlanCollaborator ||
    studyPlanCollaborator.length === 0 ||
    studyPlanCollaborator[0].role != CollaboratorRole.Owner
  )
    return NextResponse.json({}, { status: 401 });

  // TODO: Another todo, we are always taking the studyplanner with index 0, possibly needs be some kind of use preference or last viewed or something
  const currentCollab = studyPlanCollaborator[0];
  if (currentCollab.role != CollaboratorRole.Owner)
    return NextResponse.json({}, { status: 401 });

  const body: StudyPlanUpdateScopeDTO = await req.json();

  const updatePlan = await updateStudyPlanScopeByCollabId(
    currentCollab.id,
    body,
  );

  // TODO: Think about better error handling lol
  if (!updatePlan) return NextResponse.json({}, { status: 500 });

  //TODO: What should the Respone be? return StudyPlan? means the semester needs to be remapped, and if react query, refetches GET /api/study-plan that redundant <- really doesn't make sense to return the studyPlan here I think
  //  const studyPlan: StudyPlanDTO = {
  //    scope: updatePlan.scope,
  //    studyPlanCollaborator: updatePlan.studyPlanCollaborator,
  //    semesters: mappedSemesters,
  //  };

  return NextResponse.json(true);
}
