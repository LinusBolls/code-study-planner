import FuzzySearch from "fuzzy-search";

import { useLearningPlatformCurrentUser } from "@/services/learningPlatform/hooks/useLearningPlatformCurrentUser";
import { useLearningPlatformModules } from "@/services/learningPlatform/hooks/useLearningPlatformModules";
import { useLearningPlatformMySemesterList } from "@/services/learningPlatform/hooks/useLearningPlatformMySemesterList";
import { useLearningPlatformMyStudies } from "@/services/learningPlatform/hooks/useLearningPlatformMyStudies";
import { toModule } from "@/services/learningPlatform/mapping";
import { getGradeInfo } from "@/services/learningPlatform/util/getGradeInfo";
import { isDefined } from "@/services/learningPlatform/util/isDefined";

import { ModulesSearchProps } from ".";
import { useSemestersList } from "../SemestersList/useSemestersList";
import { useModulesSearchStore } from "./modulesSearchStore";

export const useModulesSearch = (): ModulesSearchProps => {
  const store = useModulesSearchStore();

  const modulesQuery = useLearningPlatformModules();

  const currentUserQuery = useLearningPlatformCurrentUser();

  const { semesters } = useSemestersList();

  const mySemesterListQuery = useLearningPlatformMySemesterList(100, 0);

  const myStudiesQuery = useLearningPlatformMyStudies();

  const flattenedModules = semesters
    .flatMap((i) => Object.values(i.modules).flat())
    .filter((i) => i.module != null);

  const currentSemesterModules =
    modulesQuery.data?.currentSemesterModules?.filter(isDefined) ?? [];

  const mandatoryModuleIds = currentUserQuery.data?.me.mandatoryModules ?? [];

  const myCurrentModules =
    mySemesterListQuery.data?.mySemesterModules?.filter(isDefined) ?? [];

  const myPastModules = myStudiesQuery.data?.myStudies?.filter(isDefined) ?? [];

  /** the modules that *would* be included in the current tab prior to getting filtered by the search and checkboxes */
  const modulesTabContents = currentSemesterModules.filter((i) => {
    const attemptedModule = myPastModules.find(
      (j) =>
        j?.moduleIdentifier === i.moduleIdentifier &&
        i.moduleIdentifier != null,
    );

    const currentModule = myCurrentModules.find(
      (j) =>
        j?.moduleIdentifier === i.moduleIdentifier &&
        i.moduleIdentifier != null,
    );

    const allFailed = attemptedModule?.assessments?.every(
      (i) => getGradeInfo(i.grade).valid && !getGradeInfo(i.grade).passed,
    );
    const hasAssessments = (attemptedModule?.assessments?.length ?? 0) > 0;

    const isPlanned = flattenedModules.some(
      (j) => j.type === "planned" && j.module?.moduleId === i.module?.id,
    );
    const isPartOfStudyPlan =
      (hasAssessments && !allFailed) || currentModule != null || isPlanned;

    if (store.filters.onlyMyStudies && attemptedModule == null) return false;

    if (store.filters.onlyMySemester && currentModule == null) return false;

    if (store.filters.onlyNotTaken && isPartOfStudyPlan) return false;

    return true;
  });

  const currentTabIsEmpty = modulesTabContents.length < 1;

  const search = new FuzzySearch(
    modulesTabContents,
    [
      "module.title",
      "module.coordinator.name",
      "module.department.name",
      "module.shortCode",
    ],
    {
      sort: true,
    },
  );

  // matches e.g. "ects:5" or "10 ects"
  const [_, ...queryEctsFilterMatches] =
    store.searchQuery.match(/ects:\s*(\d+)|(\d+)\s*ect(?:s)?/i) ?? [];

  const queryEctsFilter = queryEctsFilterMatches.filter((i) => i != null)[0];

  // matches e.g. "se" or "pm" or "id"
  const queryDepartmentFilter = store.searchQuery.match(
    /(?:^|\s+)(se|pm|id)(?:$|\s+)/i,
  );

  const passedFailedAttemptedFilter = store.searchQuery.match(
    /(?:^|\s+)(se|pm|id)(?:$|\s+)/i,
  );

  const modules =
    search
      .search(
        store.searchQuery
          .trim()
          .replace(/ects:\s*(\d+)|(\d+)\s*ect(?:s)?/i, "")
          .replace(/(?:^|\s+)(se|pm|id)(?:$|\s+)/i, ""),
      )
      ?.filter((i) => {
        if (
          queryEctsFilter != null &&
          (i.module?.ects ?? 0) < parseInt(queryEctsFilter)
        ) {
          return false;
        }
        if (
          queryDepartmentFilter != null &&
          i.module?.department?.abbreviation?.toLowerCase() !==
            queryDepartmentFilter[1].toLowerCase()
        ) {
          return false;
        }
        if (
          store.filters.onlyMandatoryOrCompulsoryElective &&
          !(
            mandatoryModuleIds.includes(i.module!.id + "|MANDATORY") ||
            mandatoryModuleIds.includes(i.module!.id + "|COMPULSORY_ELECTIVE")
          )
        )
          return false;

        if (
          store.filters.onlyAlternativeAssessment &&
          i.module!.semesterModules.some((i) => i.disabledAlternativeAssessment)
        )
          return false;

        if (
          store.filters.onlyEarlyAssessment &&
          i.module!.semesterModules.some((i) => !i.allowsEarlyAssessment)
        )
          return false;

        const attemptedModule = myPastModules.find(
          (j) =>
            j?.moduleIdentifier === i.moduleIdentifier &&
            i.moduleIdentifier != null,
        );

        if (store.filters.onlyPassed && attemptedModule?.status !== "ATTEMPTED")
          return false;
        if (
          store.filters.onlyFailed &&
          attemptedModule?.status !== "NOT_EXCUSED"
        )
          return false;

        return true;
      })
      ?.map(toModule(mandatoryModuleIds)) ?? [];

  return {
    modules,
    ...store,
    ...store.filters,
    onOnlyAlternativeAssessmentChange:
      store.actions.setOnlyAlternativeAssessment,
    onOnlyEarlyAssessmentChange: store.actions.setOnlyEarlyAssessment,
    onOnlyMandatoryOrCompulsoryElectiveChange:
      store.actions.setOnlyMandaryOrCompulsoryElective,
    onSearchQueryChange: store.actions.setSearchQuery,
    modulesTab: store.modulesTab,
    onModulesTabChange: store.setModulesTab,

    isLoading:
      modulesQuery.isLoading ||
      currentUserQuery.isLoading ||
      myStudiesQuery.isLoading ||
      mySemesterListQuery.isLoading,
    currentTabIsEmpty,
  };
};
