import { NextRequest } from "next/server";

import {
  badRequestResponse,
  StudyPlanParams,
  successResponse,
  unauthorizedResponse,
} from "@/app/api/utils";
import { CollaboratorRole } from "@/backend/entities/enums";
import { createInvite } from "@/backend/queries/invite.query";
import { getCollaborator } from "@/backend/queries/study-plan-collaborator.query";

export type CollaboratorInvitePostDTO = {
  inviteeLpId: string;
  role: CollaboratorRole;
};

export async function POST(req: NextRequest, { params }: StudyPlanParams) {
  const studyPlanCollaborator = await getCollaborator(req, params.id);

  if (
    !studyPlanCollaborator ||
    studyPlanCollaborator.role != CollaboratorRole.Owner
  )
    return unauthorizedResponse();

  const { inviteeLpId, role }: CollaboratorInvitePostDTO = await req.json();

  const invite = createInvite({
    invitedById: studyPlanCollaborator.id,
    studyPlanId: params.id,
    inviteeLpId,
    role,
  });

  if (!invite) return badRequestResponse();

  return successResponse();
}
