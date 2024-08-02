import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

import { SemesterDTO } from "@/backend/dtos/semester.dto";
import { StudyPlanDTO, StudyPlanPutDTO } from "@/backend/dtos/study-plan.dto";
import { Semester } from "@/backend/entities/semester.entity";
import { SemesterModule } from "@/backend/entities/semesterModule.entity";
import { getSemesterByStudyPlanId } from "@/backend/queries/semester.query";
import { getCollaborator } from "@/backend/queries/study-plan-collaborator.query";
import {
  getStudyPlanByCollaboratorId,
  updateStudyPlanScopeByCollabId,
} from "@/backend/queries/study-plan.query";

import {
  internalServerErrorResponse,
  StudyPlanParams,
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

export async function GET(req: NextRequest, { params }: StudyPlanParams) {
  const collaborator = await getCollaborator(req, params.id);

  if (!collaborator?.canViewStudyPlan) {
    return unauthorizedResponse();
  }

  const currentStudyPlan = await getStudyPlanByCollaboratorId(collaborator.id);

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
    studyPlanCollaborators: currentStudyPlan.studyPlanCollaborators,
    semesters: mappedSemesters,
  };

  return NextResponse.json(studyPlan);
}

/**
 * Sucessfull response for PUT/POST/DELETE is {ok: true}
 */
export async function PUT(req: NextRequest, { params }: StudyPlanParams) {
  const collaborator = await getCollaborator(req, params.id);

  if (!collaborator?.canChangeStudyPlanScope) return unauthorizedResponse();

  const body: StudyPlanPutDTO = await req.json();

  const updatePlan = await updateStudyPlanScopeByCollabId(
    collaborator.id,
    body,
  );

  // TODO: Think about better error handling lol
  if (!updatePlan) return internalServerErrorResponse();

  return successResponse();
}
