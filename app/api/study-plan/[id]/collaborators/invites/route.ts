import { NextRequest } from "next/server";

import { StudyPlanParams, unauthorizedResponse } from "@/app/api/utils";
import { CollaboratorRole } from "@/backend/entities/enums";
import { getCollaborator } from "@/backend/queries/study-plan-collaborator.query";

export type CollaboratorInvitePostDTO = {
  lpId: string;
  role: CollaboratorRole;
};

export async function POST(req: NextRequest, { params }: StudyPlanParams) {
  const studyPlanCollaborator = await getCollaborator(req, params.id);

  if (
    !studyPlanCollaborator ||
    studyPlanCollaborator.role != CollaboratorRole.Owner
  )
    return unauthorizedResponse();

  const body: CollaboratorInvitePostDTO = await req.json();
}

const findUserByEmail = (email: string) => {};

const createStudyPlanCollaborator = (userId: string, studyPlanId: string) => {};
