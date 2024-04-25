export type Issue =
  | {
      type: "missing_prerequisite";
      prerequisite: string;
      prerequisiteFor: string;
    }
  | {
      type: "missing_mandatory";
      module: string;
    }
  | {
      type: "missing_compulsory_electives";
      modules: string[];
    };

export type SuggestionFix =
  | {
      type: "missing_mandatory";
      title: React.ReactNode;
      moduleId: string;
      module: string;
    }
  | {
      type: "missing_compulsory_electives";
      title: React.ReactNode;
      moduleId: string;
      module: string;
    }
  | {
      type: "missing_prerequisite";
      title: React.ReactNode;
      prerequisite: string;
      prerequisiteFor: string;
    };

export interface Suggestion {
  title: string;
  level: "error" | "warning" | "info";
  description: React.ReactNode;
  fixes?: SuggestionFix[];
}
