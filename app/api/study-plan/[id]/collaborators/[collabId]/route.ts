import { NextRequest } from "next/server";

import {
  internalServerErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "@/app/api/utils";
import { StudyPlanCollaboratorPutDTO } from "@/backend/dtos/study-plan-collaborator.dto";
import { CollaboratorRole } from "@/backend/entities/enums";
import { getUser } from "@/backend/getUser";
import {
  deleteCollaboratorById,
  getAllCollaboratorsByStudyPlanId,
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
  const user = await getUser(req);
  if (!user) return unauthorizedResponse();

  const studyPlanCollaborators =
    await getAllCollaboratorsByStudyPlanId(studyPlanId);
  const userCollaborator = studyPlanCollaborators.find(
    (collaborator) => collaborator.userId === user.id,
  );
  if (
    !userCollaborator ||
    userCollaborator.role === CollaboratorRole.Viewer ||
    userCollaborator.role === CollaboratorRole.Editor
  )
    return unauthorizedResponse();

  const deleteCollaborator = await deleteCollaboratorById(collabId);
  if (!deleteCollaborator) return internalServerErrorResponse();

  return successResponse();
}

export async function PUT(
  req: NextRequest,
  { params: { id: studyPlanId, collabId } }: CollaborationParams,
) {
  const user = await getUser(req);
  if (!user) return unauthorizedResponse();

  const studyPlanCollaborators =
    await getAllCollaboratorsByStudyPlanId(studyPlanId);
  const userCollaborator = studyPlanCollaborators.find(
    (collaborator) => collaborator.userId === user.id,
  );
  if (
    !userCollaborator ||
    userCollaborator.role === CollaboratorRole.Viewer ||
    userCollaborator.role === CollaboratorRole.Editor
  )
    return unauthorizedResponse();

  const body: StudyPlanCollaboratorPutDTO = await req.json();
  const updatedCollaborator = await updateCollaboratorById(collabId, body);

  if (!updatedCollaborator) return internalServerErrorResponse();

  return successResponse();
}
