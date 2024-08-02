import { NextRequest, NextResponse } from "next/server";

import { StudyPlanParams, unauthorizedResponse } from "@/app/api/utils";
import { StudyPlanCollaboratorDTO } from "@/backend/dtos/study-plan-collaborator.dto";
import {
  getAllCollaboratorsByStudyPlanId,
  getCollaborator,
} from "@/backend/queries/study-plan-collaborator.query";

export async function DELETE(req: NextRequest) {}
export async function GET(req: NextRequest, { params }: StudyPlanParams) {
  const collaborator = await getCollaborator(req, params.id);

  const studyPlanCollaborators = await getAllCollaboratorsByStudyPlanId(
    params.id,
  );
  if (!collaborator?.canViewCollaborators) return unauthorizedResponse();

  const collabs: StudyPlanCollaboratorDTO[] = studyPlanCollaborators;

  return NextResponse.json(collabs);
}
