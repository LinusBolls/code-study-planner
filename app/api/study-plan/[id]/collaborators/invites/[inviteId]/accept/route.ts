import { NextRequest } from "next/server";

import {
  badRequestResponse,
  successResponse,
  unauthorizedResponse,
} from "@/app/api/utils";
import { InviteStatus } from "@/backend/entities/invite.entity";
import { getUser } from "@/backend/getUser";
import {
  getInviteById,
  updateInviteStatus,
} from "@/backend/queries/invite.query";
import { createStudyPlanCollaborator } from "@/backend/queries/study-plan-collaborator.query";

import { CollabParams } from "../utils";

export async function PUT(
  req: NextRequest,
  { params: { id, inviteId } }: CollabParams,
) {
  const user = await getUser(req);
  if (!user) return unauthorizedResponse();

  const invite = await getInviteById(inviteId);
  if (!invite) return badRequestResponse();

  if (user.lpId !== invite.inviteeLpId) return unauthorizedResponse();

  const updatedInvite = await updateInviteStatus(
    inviteId,
    InviteStatus.Accepted,
  );
  if (!updatedInvite) return badRequestResponse();

  const studyPlanCollaborator = await createStudyPlanCollaborator(
    user.id,
    id,
    updatedInvite.role,
  );
  if (!studyPlanCollaborator) return badRequestResponse();

  return successResponse();
}
