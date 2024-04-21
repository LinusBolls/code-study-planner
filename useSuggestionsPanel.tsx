import Link from "antd/es/typography/Link";
import { Suggestion } from "./components/SuggestionsPanel";
import { useModules } from "./services/apiClient/hooks/useModules";
import { useLearningPlatformCurrentUser } from "./services/learningPlatform/hooks/useLearningPlatformCurrentUser";
import { LP } from "code-university";
import { Module } from "@/app/useSemesters";
import {
  useModulesInScope,
  useSemestersList,
} from "./components/SemestersList/useSemestersList";
import { getGradeInfo } from "./services/learningPlatform/util/getGradeInfo";

const ModuleLink = ({ module }: { module?: LP.Module | null | Module }) => (
  <Link
    href={
      "https://app.code.berlin/module/" +
      module?.moduleIdentifier +
      "?shortCode=" +
      module?.shortCode +
      "&table=description"
    }
  >
    {module ? module.moduleIdentifier + " " + module.title : "Unknown module"}
  </Link>
);

/**
 * generates the contents of the `Suggestions` panel based on the user's session and their study plan
 */
export function useSuggestions() {
  const { semesters } = useSemestersList();

  const flattenedModules = semesters.flatMap((i) =>
    Object.values(i.modules).flat()
  );

  const currentUserQuery = useLearningPlatformCurrentUser();

  const modulesMetaQuery = useModules();

  const compulsoryElectivePairings =
    modulesMetaQuery.data?.compulsoryElective ?? [];

  const mandatoryModuleIds = currentUserQuery.data?.me.mandatoryModules ?? [];

  let suggestions: Suggestion[] = [];

  const { modules } = useModulesInScope();

  for (const id of mandatoryModuleIds) {
    const [moduleId, type] = id.split("|");

    const thisModule = modules.find((m) => m.moduleId === moduleId);

    if (!thisModule) {
      console.warn(`[useSuggestions] module with id ${moduleId} not found`);
      continue;
    }

    const moduleIdentifier = thisModule?.moduleIdentifier;

    const isMandatory = type === "MANDATORY";
    const isCompulsoryElective = type === "COMPULSORY_ELECTIVE";

    const partnerModuleIdentifiers = isCompulsoryElective
      ? compulsoryElectivePairings
          .find((i) => i.modules[0]?.moduleIdentifier === moduleIdentifier)
          ?.modules.slice(1)
          .map((i) => i.moduleIdentifier) ?? []
      : [];

    const partnerModules = modules.filter(
      (i) =>
        partnerModuleIdentifiers.includes(i.moduleIdentifier) &&
        i.isCompulsoryElective
    );

    if (
      isCompulsoryElective &&
      (partnerModuleIdentifiers.length === 0 ||
        partnerModules.length !== partnerModuleIdentifiers.length)
    ) {
      console.warn(
        `[useSuggestions] failed to find partner modules for compulsory elective module with id ${moduleId}`
      );
    }

    const isTaken = flattenedModules.some(
      (i) =>
        i.module.moduleIdentifier === moduleIdentifier &&
        !(i.assessment?.published && !getGradeInfo(i.assessment?.grade).passed)
    );

    const isAnyPartnerModuleTaken = partnerModules.some((i) =>
      flattenedModules.some(
        (j) =>
          j.module.moduleIdentifier === i.moduleIdentifier &&
          !(
            j.assessment?.published && !getGradeInfo(j.assessment?.grade).passed
          )
      )
    );

    // TODO: this
    const isMissingPrerequisite = false;

    if (!isTaken && isMandatory) {
      suggestions.push({
        title: "Mandatory",
        level: "error",
        description: (
          <>
            You are required to take <ModuleLink module={thisModule} />
          </>
        ),
      });
    }
    if (
      !isTaken &&
      isCompulsoryElective &&
      !isAnyPartnerModuleTaken &&
      partnerModules.length > 0
    ) {
      suggestions.push({
        title: "Compulsory elective",
        level: "error",
        description: (
          <>
            You are required to take either <ModuleLink module={thisModule} />
            {partnerModules.slice(1, -1).map((i) => (
              <>
                , <ModuleLink module={i} />
              </>
            ))}{" "}
            or <ModuleLink module={partnerModules[partnerModules.length - 1]} />
          </>
        ),
      });
    }
    if (isMissingPrerequisite) {
      suggestions.push({
        title: "Missing prerequisite",
        level: "error",
        description: (
          <>
            You are required to take <ModuleLink module={thisModule} /> before{" "}
            <ModuleLink module={thisModule} />
          </>
        ),
      });
    }
  }
  // warning: check for proficiency mismatches
  // warning: check for schedule mismatches
  // warning: only one attempt left for module
  // warning: taking dings before dongs is not recommended
  // warning: module might not be offered that semester
  // to-do: sign up for module / lu

  return {
    suggestions,
  };
}
