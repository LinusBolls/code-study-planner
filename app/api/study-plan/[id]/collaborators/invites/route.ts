import { NextRequest } from "next/server";

import {
  badRequestResponse,
  StudyPlanParams,
  successResponse,
  unauthorizedResponse,
} from "@/app/api/utils";
import { InvitePostDTO } from "@/backend/dtos/invite.dto";
import { createInvite } from "@/backend/queries/invite.query";
import { getCollaborator } from "@/backend/queries/study-plan-collaborator.query";

export async function POST(req: NextRequest, { params }: StudyPlanParams) {
  const collaborator = await getCollaborator(req, params.id);

  if (!collaborator?.canManageCollaborators) return unauthorizedResponse();

  const { inviteeLpId, role }: InvitePostDTO = await req.json();

  const invite = await createInvite({
    invitedById: collaborator.id,
    studyPlanId: params.id,
    inviteeLpId,
    role,
  });

  if (!invite) return badRequestResponse();

  return successResponse();
}
