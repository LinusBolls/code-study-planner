import { SemestersListProps } from ".";
import {
  getSemesterName,
  getUserUrl,
} from "@/services/learningPlatform/mapping";
import { Semester, SemesterModule } from "@/components/util/types";
import dayjs from "dayjs";
import { getGradeInfo } from "@/services/learningPlatform/util/getGradeInfo";
import { useStudyPlan } from "@/services/apiClient/hooks/useStudyPlan";
import { ApiSemesterModule } from "@/services/apiClient";
import { useLearningPlatformAssessmentTable } from "@/services/learningPlatform/hooks/useLearningPlatformAssessmentTable";
import { useModulesInScope } from "../util/useModulesInScope";

/**
 * aggregates the data for the kanban view of the study plan from both learning platform data and our own backend
 */
export function useSemestersList(): SemestersListProps {
  const studyPlan = useStudyPlan();

  const { modules, isLoading } = useModulesInScope();

  const assessmentTableQuery = useLearningPlatformAssessmentTable();

  const toPlannedModule = (i: ApiSemesterModule): SemesterModule => ({
    type: "planned",
    id: i.moduleId,

    module: modules.find((j) => j.id === i.moduleId)!,
    assessment: null,
  });

  const semesters =
    studyPlan.data?.semesters?.map<Semester>((semester) => {
      return {
        id: semester.id,
        lpId: semester.lpId,
        title: getSemesterName(dayjs(semester.startDate)),
        modules: {
          earlyAssessments:
            semester.modules.earlyAssessments.map(toPlannedModule),
          standartAssessments:
            semester.modules.standartAssessments.map(toPlannedModule),
          alternativeAssessments:
            semester.modules.alternativeAssessments.map(toPlannedModule),
          reassessments: semester.modules.reassessments.map(toPlannedModule),
        },
      };
    }) ?? [];

  const myAssessments = assessmentTableQuery.data?.myAssessments ?? [];

  for (const i of myAssessments) {
    const semester = semesters.find((j) => j.lpId === i.semester!.id);

    if (!semester) {
      console.warn(
        "[useSemestersList] failed to find semester:",
        i.semester!.id
      );
      continue;
    }

    const category = (() => {
      if (i.assessmentStyle === "ALTERNATIVE") {
        return semester.modules.alternativeAssessments;
      }
      if (i.assessmentType === "REASSESSMENT") {
        return semester.modules.reassessments;
      }
      if (i.assessmentType === "EARLY") {
        return semester.modules.earlyAssessments;
      }
      return semester.modules.standartAssessments;
    })();

    const highestGrade = i.grade ?? null;

    const assessedModule = modules.find((j) => j.id === i.semesterModule!.id);

    if (!assessedModule) {
      console.warn(
        "[useSemestersList] failed to find module for assessment:",
        i.semesterModule!.id,
        i.semesterModule!.moduleIdentifier
      );
      continue;
    }

    const gradeInfo = getGradeInfo(highestGrade);

    category.push({
      type: "past",
      id: i.id,
      assessment: {
        proposedDate: i.proposedDate,
        id: i.id,
        published: i.published === true,
        grade: highestGrade,
        passed: gradeInfo.passed,
        level: gradeInfo.level,
        url: "#",
        date: i.submittedOn,
        assessorName: i.assessor?.name!,
        assessorUrl: getUserUrl(i.assessor?.id!),
      },
      module: assessedModule,
    });
  }

  return {
    semesters,
    semestersQuery: { isLoading: isLoading || assessmentTableQuery.isLoading },
  };
}
