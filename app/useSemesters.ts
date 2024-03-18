import { create } from "zustand";

export interface SemesterModule {
  id: string;
  moduleId: string;
}

export interface Module {
  id: string;
  title: string;
  coordinatorName: string;
  url: string;
  coordinatorUrl: string;

  ects: number;
  isMandatory: boolean;
  isCompulsoryElective: boolean;
  departmentId: string;

  allowEarlyAssessment: boolean;
  allowAlternativeAssessment: boolean;
}

export interface Semester {
  id: string;
  title: string;

  modules: {
    earlyAssessments: SemesterModule[];
    standartAssessments: SemesterModule[];
    alternativeAssessments: SemesterModule[];
    reassessments: SemesterModule[];
  };
}

export interface SemestersStore {
  semesters: Semester[];

  actions: {
    addModuleToSemester: (
      semesterId: string,
      categoryId: string,
      moduleId: string
    ) => void;
    removeModuleFromSemester: (
      semesterId: string,
      categoryId: string,
      moduleId: string
    ) => void;
  };
}

export const modules = {
  "1": {
    id: "1",
    title: "ID_01 Haher",
    coordinatorName: "",
    coordinatorUrl: "#",
    url: "#",
    ects: 10,
    isMandatory: false,
    isCompulsoryElective: false,
    departmentId: "ID",
    allowEarlyAssessment: false,
    allowAlternativeAssessment: true,
  },
  "2": {
    id: "2",
    title: "ID_02 Generative Design",
    coordinatorName: "",
    coordinatorUrl: "#",
    url: "#",
    ects: 10,
    isMandatory: false,
    isCompulsoryElective: false,
    departmentId: "ID",
    allowEarlyAssessment: true,
    allowAlternativeAssessment: true,
  },
  "3": {
    id: "3",
    title: "ID_03 Hoher",
    coordinatorName: "",
    coordinatorUrl: "#",
    url: "#",
    ects: 10,
    isMandatory: false,
    isCompulsoryElective: false,
    departmentId: "ID",
    allowEarlyAssessment: true,
    allowAlternativeAssessment: true,
  },
  "4": {
    id: "4",
    title: "ID_04 Hoher",
    coordinatorName: "",
    coordinatorUrl: "#",
    url: "#",
    ects: 10,
    isMandatory: false,
    isCompulsoryElective: false,
    departmentId: "ID",
    allowEarlyAssessment: true,
    allowAlternativeAssessment: true,
  },
  "5": {
    id: "5",
    title: "ID_05 Hoher",
    coordinatorName: "",
    coordinatorUrl: "#",
    url: "#",
    ects: 10,
    isMandatory: false,
    isCompulsoryElective: false,
    departmentId: "ID",
    allowEarlyAssessment: true,
    allowAlternativeAssessment: true,
  },
  "6": {
    id: "6",
    title: "ID_06 Hoher",
    coordinatorName: "",
    coordinatorUrl: "#",
    url: "#",
    ects: 10,
    isMandatory: false,
    isCompulsoryElective: false,
    departmentId: "ID",
    allowEarlyAssessment: true,
    allowAlternativeAssessment: true,
  },
  "7": {
    id: "7",
    title: "ID_07 Hoher",
    coordinatorName: "",
    coordinatorUrl: "#",
    url: "#",
    ects: 10,
    isMandatory: false,
    isCompulsoryElective: false,
    departmentId: "ID",
    allowEarlyAssessment: true,
    allowAlternativeAssessment: true,
  },
  "8": {
    id: "8",
    title: "ID_08 Hoher",
    coordinatorName: "",
    coordinatorUrl: "#",
    url: "#",
    ects: 10,
    isMandatory: false,
    isCompulsoryElective: false,
    departmentId: "ID",
    allowEarlyAssessment: true,
    allowAlternativeAssessment: true,
  },
  "9": {
    id: "9",
    title: "ID_09 Hoher",
    coordinatorName: "",
    coordinatorUrl: "#",
    url: "#",
    ects: 10,
    isMandatory: false,
    isCompulsoryElective: false,
    departmentId: "ID",
    allowEarlyAssessment: true,
    allowAlternativeAssessment: true,
  },
  "10": {
    id: "10",
    title: "ID_10 Hoher",
    coordinatorName: "",
    coordinatorUrl: "#",
    url: "#",
    ects: 10,
    isMandatory: false,
    isCompulsoryElective: false,
    departmentId: "ID",
    allowEarlyAssessment: true,
    allowAlternativeAssessment: true,
  },
} satisfies Record<string, Module>;

export const useSemestersStore = create<SemestersStore>((set, get) => ({
  semesters: [
    {
      id: "fall_2021",
      title: "Fall 2021",
      modules: {
        earlyAssessments: [],
        standartAssessments: [
          { id: crypto.randomUUID(), moduleId: "1" },
          { id: crypto.randomUUID(), moduleId: "2" },
          { id: crypto.randomUUID(), moduleId: "3" },
        ],
        alternativeAssessments: [],
        reassessments: [],
      },
    },
    {
      id: "spring_2022",
      title: "Spring 2022",
      modules: {
        earlyAssessments: [
          { id: crypto.randomUUID(), moduleId: "4" },
          { id: crypto.randomUUID(), moduleId: "5" },
        ],
        standartAssessments: [],
        alternativeAssessments: [],
        reassessments: [],
      },
    },
    {
      id: "fall_2022",
      title: "Fall 2022",
      modules: {
        earlyAssessments: [],
        standartAssessments: [],
        alternativeAssessments: [],
        reassessments: [
          { id: crypto.randomUUID(), moduleId: "6" },
          { id: crypto.randomUUID(), moduleId: "7" },
        ],
      },
    },
    {
      id: "spring_2023",
      title: "Spring 2023",
      modules: {
        earlyAssessments: [],
        standartAssessments: [],
        alternativeAssessments: [],
        reassessments: [],
      },
    },
    {
      id: "fall_2023",
      title: "Fall 2023",
      modules: {
        earlyAssessments: [],
        standartAssessments: [],
        alternativeAssessments: [],
        reassessments: [],
      },
    },
    {
      id: "spring_2024",
      title: "Spring 2024",
      modules: {
        earlyAssessments: [],
        standartAssessments: [],
        alternativeAssessments: [],
        reassessments: [],
      },
    },
    {
      id: "fall_2024",
      title: "Fall 2024",
      modules: {
        earlyAssessments: [],
        standartAssessments: [],
        alternativeAssessments: [],
        reassessments: [],
      },
    },
  ],
  actions: {
    addModuleToSemester: (semesterId, categoryId, moduleId) => {
      set((state) => {
        const semester = state.semesters.find((s) => s.id === semesterId);

        if (semester) {
          semester.modules[
            categoryId as unknown as keyof typeof semester.modules
          ]!.push({
            id: crypto.randomUUID(),
            moduleId,
          });
        }
        return state;
      });
    },
    removeModuleFromSemester: (semesterId, categoryId, moduleId) => {
      set((state) => {
        const semester = state.semesters.find((s) => s.id === semesterId);

        if (semester) {
          semester.modules[
            categoryId as unknown as keyof typeof semester.modules
          ] = semester.modules[
            categoryId as unknown as keyof typeof semester.modules
          ]!.filter((m) => m.moduleId !== moduleId);
        }
        return state;
      });
    },
  },
}));

export const useSemesters = () => {
  const store = useSemestersStore();

  return store;
};
