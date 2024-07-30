import { NextRequest, NextResponse } from "next/server";

import {
  badRequestResponse,
  internalServerErrorResponse,
  StudyPlanParams,
  unauthorizedResponse,
} from "@/app/api/utils";
import { StudyPlanCollaboratorDTO } from "@/backend/dtos/study-plan-collaborator.dto";
import { getUser } from "@/backend/getUser";
import { getAllCollaboratorsByStudyPlanId } from "@/backend/queries/study-plan-collaborator.query";

export async function DELETE(req: NextRequest) {}
export async function GET(req: NextRequest, { params }: StudyPlanParams) {
  const user = await getUser(req);
  if (!user) return unauthorizedResponse();

  const studyPlanCollaborators = await getAllCollaboratorsByStudyPlanId(
    params.id,
  );
  if (studyPlanCollaborators.length === 0) return internalServerErrorResponse();

  const userIsCollab = studyPlanCollaborators.find((i) => i.userId === user.id);

  if (!userIsCollab) return unauthorizedResponse();

  const collabs: StudyPlanCollaboratorDTO[] = studyPlanCollaborators;

  return NextResponse.json(collabs);
}
