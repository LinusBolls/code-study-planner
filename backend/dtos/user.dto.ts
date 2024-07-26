import { User } from "../entities/user.entity";
import { StudyPlanCollaboratorDTO } from "./study-plan-collaborator.dto";

export interface UserDTO
  extends Omit<User, "createdAt" | "updatedAt" | "studyPlanCollaborator"> {
  studyPlanCollaborator: StudyPlanCollaboratorDTO[];
}
