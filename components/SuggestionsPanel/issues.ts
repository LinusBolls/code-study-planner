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
