import { AppDataSource } from "../datasource";
import { CollaboratorRole } from "../entities/enums";
import { Invite, InviteStatus } from "../entities/invite.entity";

export type CreateInvite = {
  invitedById: string;
  studyPlanId: string;
  inviteeLpId: string;
  role: CollaboratorRole;
};

export const createInvite = async (createInviteBody: CreateInvite): Promise<Invite | null> => {
  try {
    const inviteRepository = AppDataSource.getRepository(Invite);

    const invite = inviteRepository.create(createInviteBody)
    return await inviteRepository.save(invite);
  } catch (error) {
    console.error("createInvite: ", error);

    return null;
  }
};

export const getInviteById = async (
  inviteId: string,
): Promise<Invite | null> => {
  try {
    const inviteRepository = AppDataSource.getRepository(Invite);

    return await inviteRepository.findOne({
      where: {
        id: inviteId,
      },
    });
  } catch (error) {
    console.error("createInvite: ", error);

    return null;
  }
};

export const updateInviteStatus = async (
  inviteId: string,
  status: InviteStatus,
): Promise<Invite | null> => {
  try {
    const inviteRepository = AppDataSource.getRepository(Invite);

    const invite = await inviteRepository.findOne({
      where: {
        id: inviteId,
      },
    });

    if (!invite) return null;

    invite.status = status;

    await inviteRepository.save(invite);

    return invite;
  } catch (error) {
    console.error("createInvite: ", error);

    return null;
  }
};
