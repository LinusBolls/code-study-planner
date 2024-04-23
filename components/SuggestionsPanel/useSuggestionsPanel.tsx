import Link from "antd/es/typography/Link";
import { Suggestion } from ".";
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

const ModuleLink = ({ module }: { module?: LP.Module | null | Module }) => (
  <Link href={getModuleUrl(module?.moduleIdentifier!, module?.shortCode!)}>
    {module ? module.moduleIdentifier + " " + module.title : "Unknown module"}
  </Link>
);

/**
 * generates the contents of the `Suggestions` panel based on the user's session and their study plan
 */
export function useSuggestions() {
  const { semesters } = useSemestersList();

  const { modules } = useModulesInScope();

  const currentUserQuery = useLearningPlatformCurrentUser();

  const modulesMetaQuery = useModules();

  const { showInfoMessage } = useMessages();

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
  ).concat(getMissingPrerequisites(semesters));

  const fromId = (moduleId: string) =>
    modules.find((i) => i.moduleId === moduleId);

  const suggestions = issues.map<Suggestion>((issue) => {
    if (issue.type === "missing_compulsory_electives") {
      return {
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
      return {
        fix: () => {
          updateStudyPlan(
            [
              {
                id: modules.find((i) => i.moduleId === issue.module)!.id,
                semesterId: earliestRegistrableSemester.id,
                categoryId: "standartAssessments",
              },
            ],
            []
          );
          showInfoMessage(
            <>
              Added <ModuleLink module={fromId(issue.module)} /> to your study
              plan
            </>
          );
          // TODO: don't add it to the first semester, but to the first viable one instead
        },
        title: "Mandatory",
        level: "error",
        description: (
          <>
            You are required to take{" "}
            <ModuleLink module={fromId(issue.module)} />
          </>
        ),
      };
    } else {
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
    }
  });

  // warning: check for proficiency mismatches
  // warning: check for schedule mismatches
  // warning: only one attempt left for module
  // warning: module might not be offered that semester
  // to-do: sign up for module / lu

  return {
    suggestions,
  };
}
