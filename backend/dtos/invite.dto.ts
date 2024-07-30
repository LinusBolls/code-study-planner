import { CollaboratorRole } from "../entities/enums";
import { Invite } from "../entities/invite.entity";

export interface InviteDTO
  extends Omit<Invite, "createdAt" | "updatedAt" | "invitedBy" | "studyPlan"> {}

export type InvitePostDTO = {
  inviteeLpId: string;
  role: CollaboratorRole;
};
