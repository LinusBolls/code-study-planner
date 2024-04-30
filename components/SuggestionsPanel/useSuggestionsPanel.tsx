import Link from "antd/es/typography/Link";
import { useModules } from "../../services/apiClient/hooks/useModules";
import { useLearningPlatformCurrentUser } from "../../services/learningPlatform/hooks/useLearningPlatformCurrentUser";
import { LP } from "code-university";
import { Module } from "@/components/util/types";
import { useSemestersList } from "../SemestersList/useSemestersList";
import { getModuleUrl } from "../../services/learningPlatform/mapping";
import { useModulesInScope } from "../util/useModulesInScope";
import { useMessages } from "../util/useMessages";
import { useUpdateStudyPlan } from "../util/useDragDropContext";
import { getMissingPrerequisites } from "./getMissingPrerequisites";
import { getMissingMandatory } from "./getMissingMandatory";
import React from "react";
import { Suggestion, SuggestionFix } from "./issues";

const getModuleName = (module?: LP.Module | null | Module) =>
  module ? module.moduleIdentifier + " " + module.title : "Unknown Module";

const ModuleLink = ({ module }: { module?: LP.Module | null | Module }) => (
  <Link
    href={getModuleUrl(module?.moduleIdentifier!, module?.shortCode!)}
    target="_blank"
  >
    {getModuleName(module)}
  </Link>
);

/**
 * generates the contents of the `Suggestions` panel based on the user's session and their study plan
 */
export function useSuggestions() {
  const { semesters } = useSemestersList();

  const { modules, deprecatedModules } = useModulesInScope();

  const currentUserQuery = useLearningPlatformCurrentUser();

  const modulesMetaQuery = useModules();

  const { showInfoMessage, showErrorMessage } = useMessages();

  const { updateStudyPlan } = useUpdateStudyPlan();

  const activeSemesterIdx = semesters.findIndex((i) => i.isActive);
  const activeSemester = semesters[activeSemesterIdx];

  const earliestRegistrableSemester =
    semesters[
      activeSemesterIdx +
        (activeSemester?.canRegisterForStandardAssessments ? 0 : 1)
    ];

  const compulsoryElectivePairings =
    modulesMetaQuery.data?.compulsoryElective ?? [];

  const mandatoryModuleIds = currentUserQuery.data?.me.mandatoryModules ?? [];

  const issues = getMissingMandatory(
    semesters,
    modules,
    mandatoryModuleIds,
    compulsoryElectivePairings
  ).concat(getMissingPrerequisites(semesters, modules, deprecatedModules));

  const fromId = (moduleId: string) =>
    modules.find((i) => i.moduleId === moduleId);

  const suggestions = issues.map<Suggestion>((issue) => {
    if (issue.type === "missing_compulsory_electives") {
      return {
        fixes: issue.modules.map((module) => {
          const moduleId = modules.find((i) => i.moduleId === module)?.id!;

          return {
            type: "missing_compulsory_electives",
            title: "Take " + fromId(module)?.moduleIdentifier,
            moduleId,
            module,
          };
        }),

        title: "Compulsory elective",
        level: "error",
        description: (
          <>
            You are required to take either{" "}
            <ModuleLink module={fromId(issue.modules[0])} />
            {issue.modules.slice(1, -1).map((id) => (
              <>
                , <ModuleLink module={fromId(id)} />
              </>
            ))}{" "}
            or{" "}
            <ModuleLink
              module={fromId(issue.modules[issue.modules.length - 1])}
            />
          </>
        ),
      };
    } else if (issue.type === "missing_mandatory") {
      const moduleId = modules.find((i) => i.moduleId === issue.module)?.id!;

      return {
        fixes: [
          {
            type: "missing_mandatory",
            title: "Take next semester",
            moduleId,
            module: issue.module,
          },
        ],
        title: "Mandatory",
        level: "error",
        description: (
          <>
            You are required to take{" "}
            <ModuleLink module={fromId(issue.module)} />
          </>
        ),
      };
    } else if (issue.type === "missing_prerequisite") {
      return {
        title: "Missing prerequisite",
        level: "error",
        description: (
          <>
            You are required to take{" "}
            <ModuleLink module={fromId(issue.prerequisite)} /> before{" "}
            <ModuleLink module={fromId(issue.prerequisiteFor)} />
          </>
        ),
      };
    } else if (issue.type === "retired_module") {
      return {
        title: "Retired module",
        level: "error",
        description: (
          <>
            <ModuleLink module={fromId(issue.module)} /> is retired.
            Registrations are only possible if one has any prior attempts.
          </>
        ),
      };
    } else if (issue.type === "might_not_be_offered") {
      const thisModule = modules.find((i) => i.moduleId === issue.module);
      return {
        title: "Module might not be offered",
        level: "warning",
        description: (
          <>
            You might not be able to get assessed for{" "}
            <ModuleLink module={fromId(issue.module)} /> in {issue.semesterName}
            . Consider checking this with{" "}
            <Link href={thisModule?.coordinatorUrl} target="_blank">
              {thisModule?.coordinatorName}
            </Link>
            .
          </>
        ),
      };
    } else {
      throw new Error(
        "[useSuggestions] received invalid issue.type " + JSON.stringify(issue)
      );
    }
  });

  // warning: check for proficiency mismatches
  // warning: check for schedule mismatches
  // warning: only one attempt left for module
  // warning: module might not be offered that semester
  // to-do: sign up for module / lu

  async function applyFix(fix: SuggestionFix) {
    if (
      fix.type === "missing_mandatory" ||
      fix.type === "missing_compulsory_electives"
    ) {
      if (!fix.moduleId || !fix.module) {
        showErrorMessage(
          <>
            Failed to add <ModuleLink module={fromId(fix.module)} /> to your
            study plan
          </>
        );
        return;
      }

      updateStudyPlan(
        [
          {
            id: fix.moduleId,
            semesterId: earliestRegistrableSemester.id,
            categoryId: "standartAssessments",
          },
        ],
        []
      );
      showInfoMessage(
        <>
          Added <ModuleLink module={fromId(fix.module)} /> to your study plan
        </>
      );
      return;
    }
    throw new Error("[applyFix] received invalid fix.type " + fix.type);
  }

  return {
    suggestions,
    applyFix,
  };
}
