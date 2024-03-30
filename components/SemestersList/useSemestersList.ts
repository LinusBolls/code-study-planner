import { useLearningPlatformMyStudies } from "@/services/learningPlatform/hooks/useLearningPlatformMyStudies";
import { SemestersListProps } from ".";
import {
  isDefined,
  isUnique,
} from "@/services/learningPlatform/util/isDefined";
import { useLearningPlatformModules } from "@/services/learningPlatform/hooks/useLearningPlatformModules";
import { useLearningPlatformCurrentUser } from "@/services/learningPlatform/hooks/useLearningPlatformCurrentUser";
import { useLearningPlatformSemesterModules } from "@/services/learningPlatform/hooks/useLearningPlatformSemesterModules";
import { useLearningPlatformMySemesterList } from "@/services/learningPlatform/hooks/useLearningPlatformMySemesterList";
import { toModule } from "@/services/learningPlatform/mapping";
import { useLearningPlatformSemesters } from "@/services/learningPlatform/hooks/useLearningPlatformSemesters";
import { Semester } from "@/app/useSemesters";
import dayjs from "dayjs";
import { getGradeInfo } from "@/services/learningPlatform/util/getLevelFromGrade";

const getSemesterName = (startDate?: dayjs.Dayjs | null) => {
  if (!startDate) return "Unknown Semester";

  const isSpringSemester = startDate.month() < 6;

  const season = isSpringSemester ? "Spring" : "Fall";

  return season + " " + startDate.year();
};

export function useModulesInScope() {
  const myStudiesQuery = useLearningPlatformMyStudies();

  const myPastModules = myStudiesQuery.data?.myStudies?.filter(isDefined) ?? [];

  const modulesQuery = useLearningPlatformModules();

  const currentUserQuery = useLearningPlatformCurrentUser();

  const mandatoryModuleIds = currentUserQuery.data?.me.mandatoryModules ?? [];

  const currentSemesterModules =
    modulesQuery.data?.currentSemesterModules ?? [];

  const attemptedModuleIds = myPastModules
    // this filters only the modules ones that are retired (the web modules)
    // .filter(
    //   (i) =>
    //     currentSemesterModules.find(
    //       (j) => j.moduleIdentifier === i.moduleIdentifier
    //     ) == null
    // )
    .flatMap((i) => i.assessments!.map((j) => j.semesterModule!.id))
    .filter(isDefined)
    .filter(isUnique);

  const retiredAttemptedModulesQuery =
    useLearningPlatformSemesterModules(attemptedModuleIds);

  const retiredAttemptedModules =
    retiredAttemptedModulesQuery.data?.semesterModules ?? [];
  /**
   * includes:
   * (1) modules that can currently be taken
   * (2) modules that the user took in the past that are not available anymore
   */
  const modules = currentSemesterModules
    .concat(retiredAttemptedModules)
    .map(toModule(mandatoryModuleIds));

  return { modules };
}

export function useSemestersList(): SemestersListProps {
  const myStudiesQuery = useLearningPlatformMyStudies();

  const myPastModules = myStudiesQuery.data?.myStudies?.filter(isDefined) ?? [];

  const myPastAssessments = myPastModules.flatMap(
    (i) => i.assessments?.map((j) => ({ ...j, module: i })) ?? []
  );

  const mySemesterListQuery = useLearningPlatformMySemesterList(100, 0);

  const myCurrentModules =
    mySemesterListQuery.data?.mySemesterModules?.filter(isDefined) ?? [];

  const allSemestersQuery = useLearningPlatformSemesters();

  const allSemesters = (allSemestersQuery.data?.semesters ?? []).toReversed();

  const indexOfFirstSemesterWithAssessments =
    myPastAssessments
      .map((i) => allSemesters.findIndex((j) => j.id === i.semester!.id))
      .toSorted((a, b) => a - b)[0] ?? 0;

  const semestersInScope = allSemesters.slice(
    indexOfFirstSemesterWithAssessments
  );

  const lastSemesterStartDate = dayjs(
    semestersInScope[semestersInScope.length - 1]?.startDate
  );

  const virtualSemesters = Array.from({
    length: Math.max(0, 10 - semestersInScope.length),
  }).map((_, idx) => {
    const startDate = lastSemesterStartDate?.add((idx + 1) * 6, "months");

    return {
      id: "dummy:" + idx,
      title: getSemesterName(startDate),
      modules: {
        earlyAssessments: [],
        standartAssessments: [],
        alternativeAssessments: [],
        reassessments: [],
      },
    };
  });

  const semesters = semestersInScope
    .map<Semester>((semester) => {
      return {
        id: semester.id,
        title: semester.name,
        modules: {
          earlyAssessments: [],
          standartAssessments: [],
          alternativeAssessments: [],
          reassessments: [],
        },
      };
    })
    .concat(virtualSemesters);

  const { modules } = useModulesInScope();

  for (const i of myPastAssessments) {
    const semester = semesters.find((j) => j.id === i.semester!.id);

    if (!semester) continue;

    const category = (() => {
      if (i.assessmentStyle === "ALTERNATIVE") {
        return semester.modules.alternativeAssessments;
      }
      if (i.assessmentType === "REASSESSMENT") {
        return semester.modules.reassessments;
      }
      if (i.assessmentType === "EARLY") {
        return semester.modules.earlyAssessments;
      }
      return semester.modules.standartAssessments;
    })();

    const highestGrade = i.grade ?? null;

    const assessedModule = modules.find((j) => j.id === i.semesterModule!.id)!;

    const gradeInfo = getGradeInfo(highestGrade);

    category.push({
      type: "past",
      id: i.id,
      assessment: {
        id: i.id,
        grade: highestGrade,
        passed: gradeInfo.passed,
        level: gradeInfo.level,
        url: "#",
        date: i.submittedOn,
        assessorName: i.assessor?.name!,
        assessorUrl:
          "https://app.code.berlin/users/" +
          i.assessor?.id! +
          "?table=projects",
      },
      module: assessedModule,
    });
  }

  return {
    semesters,
    semestersQuery: myStudiesQuery,
  };
}
