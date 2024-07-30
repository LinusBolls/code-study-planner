import { SemesterModule } from "../entities/semesterModule.entity";
import { ModulesRecordDTO } from "./semester.dto";

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

export type SemesterModulePutDTO = Record<string, ModulesRecordDTO>;
