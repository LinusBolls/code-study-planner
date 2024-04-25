import { getGradeInfo } from "@/services/learningPlatform/util/getGradeInfo";
import { Module, Semester } from "../util/types";
import { Issue } from "./issues";

export interface CompulsoryElectivePairing {
  id: string;
  moduleHandbookId: string;
  modules: {
    id: string;
    lpId: string;
    proficiency: number;
    possiblyOutdated: boolean;
    moduleIdentifier: string;
  }[];
}

export function getMissingMandatory(
  semesters: Semester[],
  modules: Module[],
  mandatoryModuleIds: string[],
  compulsoryElectivePairings: CompulsoryElectivePairing[]
) {
  let issues: Issue[] = [];

  const flattenedModules = semesters
    .flatMap((i) => Object.values(i.modules).flat())
    .filter((i) => i.module != null);

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
        "[useSuggestions] failed to find partner modules for compulsory elective module",
        moduleId,
        thisModule.moduleIdentifier
      );
    }

    const isTaken = flattenedModules.some(
      (i) =>
        i.module.moduleIdentifier === moduleIdentifier &&
        !(
          i.assessment?.published &&
          getGradeInfo(i.assessment?.grade).valid &&
          !getGradeInfo(i.assessment?.grade).passed
        )
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

    if (!isTaken && isMandatory) {
      issues.push({
        type: "missing_mandatory",
        module: thisModule.moduleId,
      });
    }
    if (
      !isTaken &&
      isCompulsoryElective &&
      !isAnyPartnerModuleTaken &&
      partnerModules.length > 0
    ) {
      issues.push({
        type: "missing_compulsory_electives",
        modules: [thisModule, ...partnerModules].map((i) => i.moduleId),
      });
    }
  }
  return issues;
}
