import { NextRequest } from "next/server";

import { AppDataSource } from "../datasource";
import { StudyPlanCollaboratorPutDTO } from "../dtos/study-plan-collaborator.dto";
import { CollaboratorRole } from "../entities/enums";
import { StudyPlanCollaborator } from "../entities/studyPlanCollaborator.entity";
import { getUser } from "../getUser";

const WIP_EXPERIMENTAL_STUDY_PLAN_ID_ENFORCEMENT = false;

export async function getAllCollaboratorOwnerByUserId(
  userId: string,
): Promise<StudyPlanCollaborator[] | []> {
  try {
    const collaboratorRepository = AppDataSource.getRepository(
      StudyPlanCollaborator,
    );

    return await collaboratorRepository.find({
      where: {
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

export async function getAllCollaboratorsByStudyPlanId(
  studyPlanId: string,
): Promise<StudyPlanCollaborator[] | []> {
  try {
    const collaboratorRepository = AppDataSource.getRepository(
      StudyPlanCollaborator,
    );

    return await collaboratorRepository.find({
      where: {
        studyPlanId,
      },
    });
  } catch (error) {
    return [];
  }
}

export const createStudyPlanCollaborator = async (
  userId: string,
  studyPlanId: string,
  role: CollaboratorRole,
): Promise<StudyPlanCollaborator | null> => {
  // returns null because it is not allowed to set a new owner
  if (role === CollaboratorRole.Owner) return null;

  try {
    const collaboratorRepository = AppDataSource.getRepository(
      StudyPlanCollaborator,
    );

    const collaborator = collaboratorRepository.create({
      role,
      userId,
      studyPlanId,
    });
    return await collaboratorRepository.save(collaborator);
  } catch (error) {
    console.error("createStudyPlanCollaborator error: ", error);
    return null;
  }
};

export const deleteCollaboratorById = async (collabId: string) => {
  try {
    const collaboratorRepository = AppDataSource.getRepository(
      StudyPlanCollaborator,
    );

    return await collaboratorRepository.delete({
      id: collabId,
    });
  } catch (error) {
    console.error("createStudyPlanCollaborator error: ", error);
    return null;
  }
};

export const updateCollaboratorById = async (
  collabId: string,
  body: StudyPlanCollaboratorPutDTO,
) => {
  try {
    const collaboratorRepository = AppDataSource.getRepository(
      StudyPlanCollaborator,
    );

    await collaboratorRepository.update({ id: collabId }, body);

    return await collaboratorRepository.findOne({ where: { id: collabId } });
  } catch (error) {
    console.error("createStudyPlanCollaborator error: ", error);
    return null;
  }
};

export const getCollaborator = async (
  req: NextRequest,
  studyPlanId: string,
): Promise<StudyPlanCollaborator | null> => {
  const user = await getUser(req);

  if (!user) return null;

  const studyPlanCollaborators = WIP_EXPERIMENTAL_STUDY_PLAN_ID_ENFORCEMENT
    ? await getAllCollaboratorsByStudyPlanId(studyPlanId)
    : await getAllCollaboratorOwnerByUserId(user.id);

  const userCollaborator =
    studyPlanCollaborators.find(
      (collaborator) => collaborator.userId === user.id,
    ) ?? null;

  if (!userCollaborator) return null;

  return userCollaborator;
};
