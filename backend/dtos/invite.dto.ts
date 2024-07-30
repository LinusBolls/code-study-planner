import { Invite } from "../entities/invite.entity";

export interface InviteDTO
  extends Omit<Invite, "createdAt" | "updatedAt" | "invitedBy" | "studyPlan"> {}
