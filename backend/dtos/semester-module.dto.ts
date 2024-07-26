import { SemesterModule } from "../entities/semesterModule.entity";

export interface SemesterModuleDTO
  extends Omit<
    SemesterModule,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "semester"
    | "semesterId"
    | "module"
    | "assessmentType"
    | "index"
  > {}
