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

import { CollabParams } from "../utils";

export async function PUT(
  req: NextRequest,
  { params: { inviteId } }: CollabParams,
) {
  const user = await getUser(req);

  if (!user) return unauthorizedResponse();

  const invite = await getInviteById(inviteId);

  if (!invite) return badRequestResponse();

  if (user.lpId !== invite.inviteeLpId) return unauthorizedResponse();

  const updatedInvite = await updateInviteStatus(
    inviteId,
    InviteStatus.Declined,
  );
  if (!updatedInvite) return badRequestResponse();

  return successResponse();
}
