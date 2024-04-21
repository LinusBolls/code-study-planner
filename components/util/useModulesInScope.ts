import { useLearningPlatformCurrentUser } from "@/services/learningPlatform/hooks/useLearningPlatformCurrentUser";
import { useLearningPlatformModules } from "@/services/learningPlatform/hooks/useLearningPlatformModules";
import { useLearningPlatformMyStudies } from "@/services/learningPlatform/hooks/useLearningPlatformMyStudies";
import { useLearningPlatformSemesterModules } from "@/services/learningPlatform/hooks/useLearningPlatformSemesterModules";
import { toModule } from "@/services/learningPlatform/mapping";
import {
  isDefined,
  isUnique,
} from "@/services/learningPlatform/util/isDefined";

/**
 * combines (1) modules that currently show up in the "Modules" tab of the learning platform and (2) modules that the user took in the past which might not be available anymore
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

  const modules = currentSemesterModules
    .concat(retiredAttemptedModules)
    .map(toModule(mandatoryModuleIds));

  return { modules };
}
