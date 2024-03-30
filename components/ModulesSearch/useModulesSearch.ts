import { create } from "zustand";
import { ModulesSearchProps } from ".";
import { useLearningPlatformModules } from "@/services/learningPlatform/hooks/useLearningPlatformModules";
import { useLearningPlatformCurrentUser } from "@/services/learningPlatform/hooks/useLearningPlatformCurrentUser";
import { isDefined } from "@/services/learningPlatform/util/isDefined";
import FuzzySearch from "fuzzy-search";
import { useLearningPlatformMySemesterList } from "@/services/learningPlatform/hooks/useLearningPlatformMySemesterList";
import { useLearningPlatformMyStudies } from "@/services/learningPlatform/hooks/useLearningPlatformMyStudies";
import { useEffect } from "react";
import { urlParams } from "@/services/learningPlatform/util/urlParams";
import { toModule } from "@/services/learningPlatform/mapping";

export interface ModulesSearchStore {
  searchQuery: string;

  filters: {
    onlyMandatoryOrCompulsoryElective: boolean;

    onlyAlternativeAssessment: boolean;
    onlyEarlyAssessment: boolean;

    onlyPassed: boolean;
    onlyFailed: boolean;
    onlyMyStudies: boolean;
    onlyMySemester: boolean;
  };

  actions: {
    setSearchQuery: (query: string) => void;
    setOnlyMandaryOrCompulsoryElective: (value: boolean) => void;
    setOnlyAlternativeAssessment: (value: boolean) => void;
    setOnlyEarlyAssessment: (value: boolean) => void;
    setOnlyPassed: (value: boolean) => void;
    setOnlyFailed: (value: boolean) => void;
    setOnlyMyStudies: (value: boolean) => void;
    setOnlyMySemester: (value: boolean) => void;
    clearFilters: () => void;
  };
}
const useModulesSearchStore = create<ModulesSearchStore>(
  // persist<ModulesSearchStore>(
  (set) => ({
    searchQuery: urlParams.get("q") ?? "",

    filters: {
      onlyMandatoryOrCompulsoryElective: urlParams.get("mandatory"),
      onlyAlternativeAssessment: urlParams.get("alternative"),
      onlyEarlyAssessment: urlParams.get("early"),
      onlyPassed: urlParams.get("passed"),
      onlyFailed: urlParams.get("failed"),
      onlyMyStudies: urlParams.get("my-studies"),
      onlyMySemester: urlParams.get("my-semester"),
    },

    actions: {
      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },
      setOnlyMandaryOrCompulsoryElective: (value: boolean) => {
        set((prev) => ({
          filters: {
            ...prev.filters,
            onlyMandatoryOrCompulsoryElective: value,
          },
        }));
      },
      setOnlyAlternativeAssessment: (value: boolean) => {
        set((prev) => ({
          filters: { ...prev.filters, onlyAlternativeAssessment: value },
        }));
      },
      setOnlyEarlyAssessment: (value: boolean) => {
        set((prev) => ({
          filters: { ...prev.filters, onlyEarlyAssessment: value },
        }));
      },
      setOnlyPassed: (value: boolean) => {
        set((prev) => ({
          filters: { ...prev.filters, onlyPassed: value },
        }));
      },
      setOnlyFailed: (value: boolean) => {
        set((prev) => ({
          filters: { ...prev.filters, onlyFailed: value },
        }));
      },
      setOnlyMyStudies: (value: boolean) => {
        set((prev) => ({
          filters: { ...prev.filters, onlyMyStudies: value },
        }));
      },
      setOnlyMySemester: (value: boolean) => {
        set((prev) => ({
          filters: { ...prev.filters, onlyMySemester: value },
        }));
      },
      clearFilters: () => {
        set({
          filters: {
            onlyMandatoryOrCompulsoryElective: false,
            onlyAlternativeAssessment: false,
            onlyEarlyAssessment: false,
            onlyPassed: false,
            onlyFailed: false,
            onlyMyStudies: false,
            onlyMySemester: false,
          },
        });
      },
    },
  })
  //   , {
  //     name: "modules-search",
  //     storage: createJSONStorage(() => hashStorage),
  //   }
  // ) as any
);

export const useModulesSearch = (): ModulesSearchProps => {
  const store = useModulesSearchStore();

  useEffect(() => {
    urlParams.set("q", store.searchQuery);
    urlParams.set("mandatory", store.filters.onlyMandatoryOrCompulsoryElective);
    urlParams.set("alternative", store.filters.onlyAlternativeAssessment);
    urlParams.set("early", store.filters.onlyEarlyAssessment);
    urlParams.set("passed", store.filters.onlyPassed);
    urlParams.set("failed", store.filters.onlyFailed);
    urlParams.set("my-studies", store.filters.onlyMyStudies);
    urlParams.set("my-semester", store.filters.onlyMySemester);
  }, [
    store.searchQuery,
    store.filters.onlyAlternativeAssessment,
    store.filters.onlyEarlyAssessment,
    store.filters.onlyFailed,
    store.filters.onlyMandatoryOrCompulsoryElective,
    store.filters.onlyMySemester,
    store.filters.onlyMyStudies,
    store.filters.onlyPassed,
  ]);

  const modulesQuery = useLearningPlatformModules();

  const currentUserQuery = useLearningPlatformCurrentUser();

  const mandatoryModuleIds = currentUserQuery.data?.me.mandatoryModules ?? [];

  const currentSemesterModules =
    modulesQuery.data?.currentSemesterModules?.filter(isDefined) ?? [];

  // type Ding = Parse<"$module.coordinator", LP.ViewerTakenSemesterModule>;

  const search = new FuzzySearch(
    currentSemesterModules,
    [
      "module.title",
      "module.coordinator.name",
      "module.department.name",
      "module.shortCode",
    ],
    {
      sort: true,
    }
  );

  // matches e.g. "ects:5" or "10 ects"
  const [_, ...queryEctsFilterMatches] =
    store.searchQuery.match(/ects:\s*(\d+)|(\d+)\s*ect(?:s)?/i) ?? [];

  const queryEctsFilter = queryEctsFilterMatches.filter((i) => i != null)[0];

  // matches e.g. "se" or "pm" or "id"
  const queryDepartmentFilter = store.searchQuery.match(
    /(?:^|\s+)(se|pm|id)(?:$|\s+)/i
  );

  const passedFailedAttemptedFilter = store.searchQuery.match(
    /(?:^|\s+)(se|pm|id)(?:$|\s+)/i
  );

  const mySemesterListQuery = useLearningPlatformMySemesterList(100, 0);

  const myCurrentModules =
    mySemesterListQuery.data?.mySemesterModules?.filter(isDefined) ?? [];

  const myStudiesQuery = useLearningPlatformMyStudies();

  const myPastModules = myStudiesQuery.data?.myStudies?.filter(isDefined) ?? [];

  const modules =
    search
      .search(
        store.searchQuery
          .trim()
          .replace(/ects:\s*(\d+)|(\d+)\s*ect(?:s)?/i, "")
          .replace(/(?:^|\s+)(se|pm|id)(?:$|\s+)/i, "")
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
            i.moduleIdentifier != null
        );

        if (store.filters.onlyMyStudies && attemptedModule == null)
          return false;

        if (store.filters.onlyPassed && attemptedModule?.status !== "ATTEMPTED")
          return false;
        if (
          store.filters.onlyFailed &&
          attemptedModule?.status !== "NOT_EXCUSED"
        )
          return false;

        const currentModule = myCurrentModules.find(
          (j) =>
            j?.moduleIdentifier === i.moduleIdentifier &&
            i.moduleIdentifier != null
        );

        if (store.filters.onlyMySemester && currentModule == null) return false;

        return true;
      })
      ?.map(toModule(mandatoryModuleIds)) ?? [];

  function onModulesTabChange(value: string) {
    if (value === "all") {
      store.actions.setOnlyMyStudies(false);
      store.actions.setOnlyMySemester(false);
      return;
    } else if (value === "my-studies") {
      store.actions.setOnlyMyStudies(true);
      store.actions.setOnlyMySemester(false);
      return;
    } else if (value === "my-semester") {
      store.actions.setOnlyMyStudies(false);
      store.actions.setOnlyMySemester(true);
      return;
    }
    throw new Error(
      "invalid modules tab (must be one of 'all', 'my-studies', 'my-semester'): " +
        value
    );
  }
  const modulesTab = store.filters.onlyMyStudies
    ? "my-studies"
    : store.filters.onlyMySemester
    ? "my-semester"
    : "all";

  const modulesTabContents = currentSemesterModules.filter((i) => {
    const attemptedModule = myPastModules.find(
      (j) =>
        j?.moduleIdentifier === i.moduleIdentifier && i.moduleIdentifier != null
    );

    const currentModule = myCurrentModules.find(
      (j) =>
        j?.moduleIdentifier === i.moduleIdentifier && i.moduleIdentifier != null
    );

    if (store.filters.onlyMyStudies && attemptedModule == null) return false;

    if (store.filters.onlyMySemester && currentModule == null) return false;

    return true;
  });

  const currentTabIsEmpty = modulesTabContents.length < 1;

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
    modulesTab,
    onModulesTabChange,

    isLoading: modulesQuery.isLoading,
    currentTabIsEmpty,
  };
};
