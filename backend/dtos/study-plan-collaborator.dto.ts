import { StudyPlanCollaborator } from "../entities/studyPlanCollaborator.entity";
import { UserDTO } from "./user.dto";

export interface StudyPlanCollaboratorDTO
  extends Omit<
    StudyPlanCollaborator,
    "createdAt" | "updatedAt" | "studyPlan" | "user"
  > {}
