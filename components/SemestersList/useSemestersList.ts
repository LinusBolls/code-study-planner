import { useLearningPlatformMyStudies } from "@/services/learningPlatform/hooks/useLearningPlatformMyStudies";
import { SemestersListProps } from ".";
import {
  isDefined,
  isUnique,
} from "@/services/learningPlatform/util/isDefined";
import { useLearningPlatformModules } from "@/services/learningPlatform/hooks/useLearningPlatformModules";
import { useLearningPlatformCurrentUser } from "@/services/learningPlatform/hooks/useLearningPlatformCurrentUser";
import { useLearningPlatformSemesterModules } from "@/services/learningPlatform/hooks/useLearningPlatformSemesterModules";
import { toModule } from "@/services/learningPlatform/mapping";
import { Semester, SemesterModule } from "@/app/useSemesters";
import dayjs from "dayjs";
import { getGradeInfo } from "@/services/learningPlatform/util/getGradeInfo";
import { useStudyPlan } from "@/services/apiClient/hooks/useStudyPlan";
import { ApiSemesterModule } from "@/services/apiClient";
import { useLearningPlatformAssessmentTable } from "@/services/learningPlatform/hooks/useLearningPlatformAssessmentTable";

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
  const studyPlan = useStudyPlan();

  const { modules } = useModulesInScope();

  const assessmentTableQuery = useLearningPlatformAssessmentTable();

  const toPlannedModule = (i: ApiSemesterModule): SemesterModule => ({
    type: "planned",
    id: i.moduleId,

    module: modules.find((j) => j.id === i.moduleId)!,
    assessment: null,
  });

  const semesters =
    studyPlan.data?.semesters?.map<Semester>((semester) => {
      return {
        id: semester.id,
        lpId: semester.lpId,
        title: getSemesterName(dayjs(semester.startDate)),
        modules: {
          earlyAssessments:
            semester.modules.earlyAssessments.map(toPlannedModule),
          standartAssessments:
            semester.modules.standartAssessments.map(toPlannedModule),
          alternativeAssessments:
            semester.modules.alternativeAssessments.map(toPlannedModule),
          reassessments: semester.modules.reassessments.map(toPlannedModule),
        },
      };
    }) ?? [];

  for (const i of assessmentTableQuery.data?.myAssessments ?? []) {
    const semester = semesters.find((j) => j.lpId === i.semester!.id);

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
        proposedDate: i.proposedDate,
        id: i.id,
        published: i.published === true,
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
    semestersQuery: assessmentTableQuery,
  };
}
