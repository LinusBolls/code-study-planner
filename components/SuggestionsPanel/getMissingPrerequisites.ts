import { getGradeInfo } from "@/services/learningPlatform/util/getGradeInfo";
import { Semester, SemesterModule } from "../util/types";
import { Issue } from "./issues";

export const getMissingPrerequisites = (semesters: Semester[]) => {
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
        const prerequisites = coords.filter(
          (j) => j.module.module?.moduleId === id
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
