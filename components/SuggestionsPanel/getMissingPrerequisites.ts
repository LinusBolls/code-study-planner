import { getGradeInfo } from "@/services/learningPlatform/util/getGradeInfo";
import { Module, Semester, SemesterModule } from "../util/types";
import { Issue } from "./issues";

// for leonard darsow (pm sixthsense), some modules are flagged as having os_04 as a prerequisite, but that doesn't seem to actually be the case
const OS_04_ID = "ckowsvvgt60710wl30sp7zbrf";

export const getMissingPrerequisites = (
  semesters: Semester[],
  modules: Module[],
  missingModules: {
    id: string;
    moduleIdentifier?: string | null;
  }[]
) => {
  let coords: {
    module: SemesterModule;
    semesterId: string;
    semesterIdx: number;
    categoryId: string;
  }[] = [];

  let issues: Issue[] = [];

  const currentSemesterIdx = semesters.findIndex((i) => i.isActive);

  for (const [semesterIdx, semester] of semesters.entries()) {
    for (const [categoryId, theseModules] of Object.entries(semester.modules)) {
      for (const thisModule of theseModules) {
        coords.push({
          module: thisModule,
          semesterId: semester.id,
          semesterIdx,
          categoryId,
        });
      }
    }
  }
  for (const coord of coords) {
    const isRetired = coord.module.module?.retired ?? false;

    const hasPriorAttempts = coord.module.assessment != null; // getGradeInfo(coord.module.assessment?.grade).valid;

    if (isRetired && !hasPriorAttempts) {
      issues.push({
        type: "retired_module",
        module: coord.module.module?.moduleId!,
      });
    }
    if (
      coord.module.module?.frequency === "YEARLY" &&
      coord.module.module?.allowsRegistration === false
    ) {
      const offsetToActiveSemester = currentSemesterIdx - coord.semesterIdx;

      if (coord.semesterIdx >= currentSemesterIdx) {
        const mightNotBeAvailable =
          Math.abs(offsetToActiveSemester) % 2 === 0
            ? !coord.module.module.allowsRegistration
            : coord.module.module.allowsRegistration;

        if (mightNotBeAvailable) {
          issues.push({
            type: "might_not_be_offered",
            module: coord.module.module?.moduleId!,
            semesterName: semesters[currentSemesterIdx]?.title,
          });
        }
      }
    }

    const missingPrerequisiteIds =
      coord.module.module?.prerequisites.filter((id) => {
        // TODO: prerequisite might not be offered anymore (so we kinda need to query every module ever lol)
        const thisModule = modules.find((i) => i.moduleId === id);

        const missingModule = (missingModules ?? []).find((i) => i.id === id);

        const moduleIdentifier =
          thisModule?.moduleIdentifier ?? missingModule?.moduleIdentifier;

        if (id === OS_04_ID) return false;

        const prerequisites = coords.filter(
          (j) =>
            // we can't directly compare module ids here, otherwise os_05 and os_05_v2 would not be considered equivalent
            j.module.module?.moduleIdentifier === moduleIdentifier
        );
        const sache =
          prerequisites.length < 1 ||
          prerequisites.every((prerequisite) => {
            const isMissingPrerequisite =
              prerequisite.semesterIdx >= coord.semesterIdx ||
              (getGradeInfo(prerequisite.module.assessment?.grade).valid &&
                !getGradeInfo(prerequisite.module.assessment?.grade).passed);

            return isMissingPrerequisite;
          });

        return sache;
      }) ?? [];

    issues = issues.concat(
      missingPrerequisiteIds.map((id) => ({
        type: "missing_prerequisite",
        prerequisite: id,
        prerequisiteFor: coord.module.module?.moduleId,
      }))
    );
  }
  return issues;
};
