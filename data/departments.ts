export interface Department {
  id: string;
  title: string;
  color: string;
}

export const Department = {
  SE: {
    id: "SE",
    title: "Software Engineering",
    color: "#FF4473",
  },
  PM: {
    id: "PM",
    title: "Product Management",
    color: "#4059AD",
  },
  ID: {
    id: "ID",
    title: "Interaction Design",
    color: "#35DAAD",
  },
  STS: {
    id: "STS",
    title: "Science, Technology, and Society",
    color: "#FEDD9A",
  },
  IS: {
    id: "IS",
    title: "Interpersonal Skills",
    color: "#FEDD9A",
  },
} satisfies Record<string, Department>;

/**
 * some modules, (e.g. Bachelor Thesis, Capstone Project, Special Mobility Module) do not have a department
 */
export const getDepartment = (id?: string | null): Department | null => {
  if (typeof id !== "string" || !(id in Department)) return null;

  return Department[id as keyof typeof Department];
};
