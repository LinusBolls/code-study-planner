import { NextRequest } from "next/server";

import { AppDataSource } from "../datasource";
import {
  CollaboratorRole,
  StudyPlanCollaborator,
} from "../entities/studyPlanCollaborator.entity";
import { getUser } from "../getUser";

export async function getAllCollaboratorOwnerByUserId(
  userId: string,
): Promise<StudyPlanCollaborator[] | []> {
  try {
    const collaboratorRepository = AppDataSource.getRepository(
      StudyPlanCollaborator,
    );

    return await collaboratorRepository.find({
      where: {
        hasAccepted: true,
        role: CollaboratorRole.Owner,
        user: {
          id: userId,
        },
      },
    });
  } catch (error) {
    return [];
  }
}

export const getCollaborator = async (
  req: NextRequest,
  studyPlanId: string,
): Promise<StudyPlanCollaborator | null> => {
  const user = await getUser(req);

  if (!user) return null;

  const collaborators = await getAllCollaboratorOwnerByUserId(user.id);

  const collaborator = collaborators.length === 0 ? collaborators[0] : null;

  return collaborator;

  // TODO: currently not using studyPlanId, waiting for frontend Integration
  //  const collaborator = collaborators.filter(i => i.studyPlanId === studyPlanId);
  //
  //  if (collaborator.length !== 1)
  //    return null
  //
  //  return collaborator[0];
};
