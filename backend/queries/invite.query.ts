import { AppDataSource } from "../datasource";
import { CollaboratorRole } from "../entities/enums";
import { Invite } from "../entities/invite.entity";

export type CreateInvite = {
  invitedById: string;
  studyPlanId: string;
  inviteeLpId: string;
  role: CollaboratorRole;
};

export const createInvite = (createInviteBody: CreateInvite): Invite | null => {
  try {
    const inviteRepository = AppDataSource.getRepository(Invite);

    return inviteRepository.create(createInviteBody);
  } catch (error) {
    console.error("createInvite: ", error);

    return null;
  }
};
