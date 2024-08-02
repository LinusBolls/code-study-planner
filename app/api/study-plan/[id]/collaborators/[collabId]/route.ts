import { NextRequest } from "next/server";

import {
  internalServerErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "@/app/api/utils";
import { StudyPlanCollaboratorPutDTO } from "@/backend/dtos/study-plan-collaborator.dto";
import {
  deleteCollaboratorById,
  getCollaborator,
  updateCollaboratorById,
} from "@/backend/queries/study-plan-collaborator.query";

export type CollaborationParams = {
  params: {
    id: string;
    collabId: string;
  };
};

export async function DELETE(
  req: NextRequest,
  { params: { id: studyPlanId, collabId } }: CollaborationParams,
) {
  const collaborator = await getCollaborator(req, studyPlanId);

  if (!collaborator?.canManageCollaborators) return unauthorizedResponse();

  const deleteCollaborator = await deleteCollaboratorById(collabId);
  if (!deleteCollaborator) return internalServerErrorResponse();

  return successResponse();
}

export async function PUT(
  req: NextRequest,
  { params: { id: studyPlanId, collabId } }: CollaborationParams,
) {
  const collaborator = await getCollaborator(req, studyPlanId);

  if (!collaborator?.canManageCollaborators) return unauthorizedResponse();

  const body: StudyPlanCollaboratorPutDTO = await req.json();
  const updatedCollaborator = await updateCollaboratorById(collabId, body);

  if (!updatedCollaborator) return internalServerErrorResponse();

  return successResponse();
}
