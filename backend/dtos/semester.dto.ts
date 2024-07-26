import { Semester } from "../entities/semester.entity";
import { SemesterModuleDTO } from "./semester-module.dto";

export interface SemesterDTO
  extends Omit<
    Semester,
    | "createdAt"
    | "updatedAt"
    | "studyPlan"
    | "studyPlanId"
    | "semesterModules"
    | "lpId"
  > {
  modules: ModulesRecordDTO;
  lpId: string | null;
}

export interface ModulesRecordDTO {
  earlyAssessments: SemesterModuleDTO[];
  standardAssessments: SemesterModuleDTO[];
  alternativeAssessments: SemesterModuleDTO[];
  reassessments: SemesterModuleDTO[];
}
