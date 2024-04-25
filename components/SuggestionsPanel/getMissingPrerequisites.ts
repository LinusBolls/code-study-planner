import { getGradeInfo } from "@/services/learningPlatform/util/getGradeInfo";
import { Module, Semester, SemesterModule } from "../util/types";
import { Issue } from "./issues";

// for leonard darsow (pm sixthsense), some modules are flagged as having os_04 as a prerequisite, but that doesn't seem to actually be the case
const OS_04_ID = "ckowsvvgt60710wl30sp7zbrf";

export const getMissingPrerequisites = (
  semesters: Semester[],
  modules: Module[]
) => {
  let coords: {
    module: SemesterModule;
    semesterId: string;
    semesterIdx: number;
    categoryId: string;
  }[] = [];

  let issues: Issue[] = [];

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
    const missingPrerequisiteIds =
      coord.module.module?.prerequisites.filter((id) => {
        const thisModule = modules.find((i) => i.moduleId === id);

        if (id === OS_04_ID) return false;

        const prerequisites = coords.filter(
          (j) =>
            // we can't directly compare module ids here, otherwise os_05 and os_05_v2 would not be considered equivalent
            j.module.module?.moduleIdentifier === thisModule?.moduleIdentifier
        );

        return (
          prerequisites.length < 1 ||
          prerequisites.every((prerequisite) => {
            const isMissingPrerequisite =
              prerequisite.semesterIdx >= coord.semesterIdx ||
              (getGradeInfo(prerequisite.module.assessment?.grade).valid &&
                !getGradeInfo(prerequisite.module.assessment?.grade).passed);

            return isMissingPrerequisite;
          })
        );
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
