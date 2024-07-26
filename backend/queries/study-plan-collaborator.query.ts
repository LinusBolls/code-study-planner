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

export const getCollaborator = async (req: NextRequest) => {
  const user = await getUser(req);

  if (!user) return null;

  return await getAllCollaboratorOwnerByUserId(user.id);
};
