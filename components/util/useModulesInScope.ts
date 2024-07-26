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
    .map(toModule(mandatoryModuleIds));

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
