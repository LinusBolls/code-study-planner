import { CollaboratorRole } from "../entities/enums";
import { StudyPlanCollaborator } from "../entities/studyPlanCollaborator.entity";
import { UserDTO } from "./user.dto";

export interface StudyPlanCollaboratorDTO
  extends Omit<
    StudyPlanCollaborator,
    "createdAt" | "updatedAt" | "studyPlan" | "user"
  > {}

export type StudyPlanCollaboratorPutDTO = {
  role: CollaboratorRole;
};
