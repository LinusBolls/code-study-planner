import { LP } from "code-university";

export interface Assessment {
  proposedDate: string;
  id: string;
  date: number;
  published: boolean;
  assessorName: string;
  assessorUrl: string;
  grade: number | null;
  level: number | null;
  passed: boolean;
  url: string;
}
// i hate enums i hate enums i hate enums
export type ModuleFrequency = `${LP.ModuleFrequency}`;

export interface Module {
  /** the id of the corresponding SemesterModule on the learning platform api */
  id: string;
  /** e.g. "SE_19" */
  moduleIdentifier: string;
  /** the id of the corresponding Module on the learning platform api */
  moduleId: string;
  title: string;
  coordinatorName: string;
  url: string;
  registerUrl: string;
  coordinatorUrl: string;
  shortCode: string;

  ects: number;
  isMandatory: boolean;
  isCompulsoryElective: boolean;
  departmentId: string;

  allowEarlyAssessment: boolean;
  allowAlternativeAssessment: boolean;
  isGraded: boolean;
  frequency: ModuleFrequency;
  prerequisites: string[];
  prerequisiteFor: string[];
}

export interface PastModule {
  type: "past";

  id: string;
  module: Module;

  assessment: Assessment;
}
export interface PlannedModule {
  type: "planned";

  id: string;
  module: Module;

  assessment: null;
}
export type SemesterModule = PastModule | PlannedModule;

export interface Semester {
  id: string;
  lpId: string;
  title: string;
  isActive: boolean;

  canRegisterForEarlyAssessments: boolean;
  canRegisterForStandardAssessments: boolean;
  canRegisterForAlternativeAssessments: boolean;
  canRegisterForReassessments: boolean;

  modules: {
    earlyAssessments: SemesterModule[];
    standartAssessments: SemesterModule[];
    alternativeAssessments: SemesterModule[];
    reassessments: SemesterModule[];
  };
}
