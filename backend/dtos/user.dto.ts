import { User } from "../entities/user.entity";
import { InviteDTO } from "./invite.dto";
import { StudyPlanCollaboratorDTO } from "./study-plan-collaborator.dto";
import { StudyPlanDTO } from "./study-plan.dto";

export interface UserDTO
  extends Omit<
    User,
    | "createdAt"
    | "updatedAt"
    | "studyPlanCollaborators"
    | "studyPlans"
    | "invites"
  > {
  studyPlanCollaborators: StudyPlanCollaboratorDTO[];
  studyPlans: StudyPlanDTO[];
  invites: InviteDTO[];
}
