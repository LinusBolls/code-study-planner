import { User } from "../entities/user.entity";

export interface UserDTO
  extends Omit<User, "createdAt" | "updatedAt" | "studyPlanCollaborator"> {}
