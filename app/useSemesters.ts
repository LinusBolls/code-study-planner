import { useUpdateSemesterModule } from "@/services/apiClient/hooks/useUpdateSemesterModules";

export interface Assessment {
  id: string;
  date: number;
  assessorName: string;
  assessorUrl: string;
  grade: number | null;
  level: number | null;
  passed: boolean;
  url: string;
}

export interface Module {
  id: string;
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

  modules: {
    earlyAssessments: SemesterModule[];
    standartAssessments: SemesterModule[];
    alternativeAssessments: SemesterModule[];
    reassessments: SemesterModule[];
  };
}
