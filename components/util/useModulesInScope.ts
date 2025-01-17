import { useLearningPlatformAssessmentTable } from "@/services/learningPlatform/hooks/useLearningPlatformAssessmentTable";
import { useLearningPlatformCurrentUser } from "@/services/learningPlatform/hooks/useLearningPlatformCurrentUser";
import { useLearningPlatformModules } from "@/services/learningPlatform/hooks/useLearningPlatformModules";
import { useLearningPlatformModulesById } from "@/services/learningPlatform/hooks/useLearningPlatformModulesById";
import { useLearningPlatformMyStudies } from "@/services/learningPlatform/hooks/useLearningPlatformMyStudies";
import { useLearningPlatformSemesterModules } from "@/services/learningPlatform/hooks/useLearningPlatformSemesterModules";
import { toModule } from "@/services/learningPlatform/mapping";
import {
  isDefined,
  isUnique,
} from "@/services/learningPlatform/util/isDefined";

/**
 * combines (1) modules that currently show up in the "Modules" tab of the learning platform (2) modules that the user took in the past which might not be available anymore (3) prerequisite modules that might not be available anymore
 */
export function useModulesInScope() {
  const myStudiesQuery = useLearningPlatformMyStudies();

  const myPastModules = myStudiesQuery.data?.myStudies?.filter(isDefined) ?? [];

  const modulesQuery = useLearningPlatformModules();

  const currentUserQuery = useLearningPlatformCurrentUser();

  const mandatoryModuleIds = currentUserQuery.data?.me.mandatoryModules ?? [];

  const currentSemesterModules =
    modulesQuery.data?.currentSemesterModules ?? [];

  const assessmentTableQuery = useLearningPlatformAssessmentTable();

  const myAssessments = assessmentTableQuery.data?.myAssessments ?? [];

  /**
   * we need this to see whether the modules a user has been assessed on in the past are mandatory.
   *
   * every few semesters, the learning platform api comes out with new "versions" of existing modules under the hood.
   * for example, a new `SE_01_v3` module gets created, and `SE_01_v2` doesn't get displayed anymore.
   *
   * this is annoying because `currentUserQuery.data?.me.mandatoryModules` only includes the ids of the "newest version" of each module.
   * if we only relied on these ids, `SE_01_v3` would be mandatory, but `SE_01_v2` wouldn't be.
   * to fix this, we get the "newest" version of each module that the user has been assessed on in the past, by comparing their `simpleShortCode`.
   *
   */
  const additionalMandatoryModuleIds = myAssessments.flatMap((i) => {
    const newModule = currentSemesterModules.find(
      (j) => j.module!.simpleShortCode === i.module!.simpleShortCode,
    );
    if (!newModule) return [];

    if (mandatoryModuleIds.includes(newModule!.module!.id + "|MANDATORY"))
      return [i.module!.id + "|MANDATORY"];

    if (
      mandatoryModuleIds.includes(
        newModule!.module!.id + "|COMPULSORY_ELECTIVE",
      )
    )
      return [i.module!.id + "|COMPULSORY_ELECTIVE"];

    return [];
  });

  const attemptedModuleIds = myPastModules
    .flatMap((i) => i.assessments!.map((j) => j.semesterModule!.id))
    .filter(isDefined)
    .filter(isUnique);

  const retiredAttemptedModulesQuery =
    useLearningPlatformSemesterModules(attemptedModuleIds);

  const retiredAttemptedModules =
    retiredAttemptedModulesQuery.data?.semesterModules ?? [];

  const modules = currentSemesterModules
    .concat(retiredAttemptedModules)
    .map(toModule(mandatoryModuleIds.concat(additionalMandatoryModuleIds)));

  const allPrerequisites = modules.flatMap((i) => i.prerequisites);

  const deprecatedPrerequisiteIds = allPrerequisites
    .filter(isUnique)
    .filter((i) => modules.find((j) => j.moduleId === i) == null);

  const deprecatedPrerequisitesQuery = useLearningPlatformModulesById(
    deprecatedPrerequisiteIds,
  );
  const deprecatedModules = deprecatedPrerequisitesQuery.data?.modules ?? [];

  return {
    /** these modules aren't available anymore, but they are prerequisites for other modules. this is important for generating the "Missing Prerequisite" suggestion in the Suggestions panel. */
    deprecatedModules,
    modules,
    isLoading:
      modulesQuery.isLoading ||
      myStudiesQuery.isLoading ||
      currentUserQuery.isLoading ||
      retiredAttemptedModulesQuery.isLoading ||
      deprecatedPrerequisitesQuery.isLoading,
  };
}
