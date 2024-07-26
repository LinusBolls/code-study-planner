import { Assessment, Module, Semester, SemesterModule } from "./types";

const dummyModule = (
  data: Omit<Partial<SemesterModule>, "module" | "assessment"> & {
    module?: Partial<Module>;
    assessment?: Partial<Assessment> | null;
  } = {},
): SemesterModule => {
  const { module = {}, assessment = null, ...rest } = data;
  return {
    id: "dummy:semester-module:1",
    type: "past",
    assessment:
      assessment == null
        ? null
        : {
            id: "dummy:assessment:1",
            assessorName: "Fabio Fracassi",
            assessorUrl: "#",
            date: "",
            grade: 2,
            level: 1,
            passed: true,
            proposedDate: null,
            published: true,
            url: "#",
            ...assessment,
          },
    module: {
      id: "dummy:module:1",
      moduleId: "",
      url: "#",
      departmentId: "SE",
      ects: 5,
      frequency: "YEARLY",
      coordinatorUrl: "#",
      isGraded: true,
      isMandatory: true,
      title: "Concepts of Programming Languages",
      shortCode: "SE_03",
      retired: false,
      registerUrl: "#",
      prerequisites: [],
      prerequisiteFor: [],
      moduleIdentifier: "",

      isCompulsoryElective: false,
      coordinatorName: "Fabio Fracassi",
      allowsRegistration: true,
      allowAlternativeAssessment: true,
      allowEarlyAssessment: false,
      ...module,
    },
    ...rest,
  } as SemesterModule;
};

export const loginscreenMockSemesters: Semester[] = [
  {
    id: "dummy:semester:1",
    title: "Spring 2024",
    lpId: null,
    isActive: true,

    canRegisterForAlternativeAssessments: true,
    canRegisterForEarlyAssessments: true,
    canRegisterForReassessments: true,
    canRegisterForStandardAssessments: true,

    modules: {
      alternativeAssessments: [],
      earlyAssessments: [
        dummyModule({
          module: {
            title: "Judging Technology",
            shortCode: "STS_05",
            coordinatorName: "Fabian Geier",
            isMandatory: false,
            allowEarlyAssessment: true,
            allowAlternativeAssessment: false,

            departmentId: "STS",
          },
          assessment: {
            level: 2,
            grade: 1.7,
          },
        }),
      ],
      reassessments: [],
      standardAssessments: [
        dummyModule({
          module: {
            title: "Cyber Security",
            shortCode: "SE_09",
            allowEarlyAssessment: true,
            coordinatorName: "Peter Ruppel",
          },
          assessment: {
            level: 2,
            grade: 1.7,
          },
        }),
        dummyModule({
          module: {
            title: "Distributed and Parallel Computing",
            shortCode: "SE_24",
            allowAlternativeAssessment: true,
            isMandatory: false,
          },
          assessment: {
            level: 1,
            grade: 2,
          },
        }),
        dummyModule({
          module: {
            title: "Hardware and Operating Systems",
            shortCode: "SE_11",
            allowAlternativeAssessment: true,
            isMandatory: false,
          },
          assessment: {
            level: 1,
            grade: 2.3,
          },
        }),
        dummyModule({
          module: {
            title: "Network Programming",
            shortCode: "SE_04",
            allowAlternativeAssessment: true,
            isMandatory: false,
          },
          assessment: {
            level: 0,
            grade: 2.7,
          },
        }),
        dummyModule({
          module: {
            title: "Agile Process Management",
            shortCode: "PM_07",
            coordinatorName: "Florian Grote",
            allowEarlyAssessment: true,
            allowAlternativeAssessment: true,

            departmentId: "PM",
          },
          assessment: {
            level: 2,
            grade: 1.7,
          },
        }),
        dummyModule({
          assessment: {
            level: 1,
            grade: 2,
          },
        }),
      ],
    },
  },
  {
    id: "dummy:semester:2",
    title: "Fall 2024",
    lpId: null,
    isActive: true,

    canRegisterForAlternativeAssessments: true,
    canRegisterForEarlyAssessments: true,
    canRegisterForReassessments: true,
    canRegisterForStandardAssessments: true,

    modules: {
      alternativeAssessments: [],
      earlyAssessments: [],
      reassessments: [],
      standardAssessments: [
        dummyModule({
          type: "planned",
        }),
        dummyModule({
          type: "planned",
        }),
        dummyModule({
          type: "planned",
        }),
        dummyModule({
          type: "planned",
        }),
        dummyModule({
          type: "planned",
        }),
        dummyModule({
          type: "planned",
        }),
      ],
    },
  },
  {
    id: "dummy:semester:3",
    title: "Spring 2025",
    lpId: null,
    isActive: true,

    canRegisterForAlternativeAssessments: true,
    canRegisterForEarlyAssessments: true,
    canRegisterForReassessments: true,
    canRegisterForStandardAssessments: true,

    modules: {
      alternativeAssessments: [
        dummyModule({
          type: "planned",
        }),
      ],
      earlyAssessments: [],
      reassessments: [],
      standardAssessments: [
        dummyModule({
          type: "planned",
        }),
        dummyModule({
          type: "planned",
        }),
        dummyModule({
          type: "planned",
        }),
        dummyModule({
          type: "planned",
        }),
        dummyModule({
          type: "planned",
        }),
      ],
    },
  },
  {
    id: "dummy:semester:4",
    title: "Fall 2025",
    lpId: null,
    isActive: true,

    canRegisterForAlternativeAssessments: true,
    canRegisterForEarlyAssessments: true,
    canRegisterForReassessments: true,
    canRegisterForStandardAssessments: true,

    modules: {
      alternativeAssessments: [],
      earlyAssessments: [],
      reassessments: [],
      standardAssessments: [],
    },
  },
];
