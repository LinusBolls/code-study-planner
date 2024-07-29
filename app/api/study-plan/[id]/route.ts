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

import {
  internalServerErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "../../utils";

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

type StudyPlanParams = {
  params: {
    id: string;
  };
};

export async function GET(req: NextRequest, { params }: StudyPlanParams) {
  const studyPlanCollaborator = await getCollaborator(req, params.id);

  if (!studyPlanCollaborator) {
    return unauthorizedResponse();
  }

  const currentStudyPlan = await getStudyPlanByCollaboratorId(
    studyPlanCollaborator.id,
  );

  if (!currentStudyPlan) {
    return unauthorizedResponse();
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

/**
 * Sucessfull response for PUT/POST/DELETE is {ok: true}
 */
export async function PUT(req: NextRequest, { params }: StudyPlanParams) {
  const studyPlanCollaborator = await getCollaborator(req, params.id);

  if (
    !studyPlanCollaborator ||
    studyPlanCollaborator.role != CollaboratorRole.Owner
  )
    return unauthorizedResponse();

  const body: StudyPlanUpdateScopeDTO = await req.json();

  const updatePlan = await updateStudyPlanScopeByCollabId(
    studyPlanCollaborator.id,
    body,
  );

  // TODO: Think about better error handling lol
  if (!updatePlan) return internalServerErrorResponse();

  return successResponse();
}
