import { useLearningPlatformAssessmentTable } from "@/services/learningPlatform/hooks/useLearningPlatformAssessmentTable";
import { ECTSPanelProps } from "../ECTSPanel";
import {
  useModulesInScope,
  useSemestersList,
} from "../SemestersList/useSemestersList";
import { getGradeInfo } from "@/services/learningPlatform/util/getGradeInfo";
import { getBachelorsGrade } from "@/services/learningPlatform/util/getBachelorsGrade";

export function useECTSPanel(): ECTSPanelProps {
  const { semesters } = useSemestersList();

  const modulesTakenByUser = semesters.flatMap((i) =>
    Object.values(i.modules).flat()
  );
  const { modules } = useModulesInScope();

  const assessmentTableQuery = useLearningPlatformAssessmentTable();

  const myAssessments = assessmentTableQuery.data?.myAssessments ?? [];

  const gradeInputModules = myAssessments.reduce<
    Record<string, { ects: number; grade: number }>
  >((acc, i) => {
    const existing = acc[i.semesterModule!.moduleIdentifier!];

    const assessedModule = modules.find((j) => j.id === i.semesterModule!.id)!;

    if (
      i.grade != null &&
      getGradeInfo(i.grade).passed &&
      (!existing || existing.grade < i.grade)
    ) {
      acc[i.semesterModule!.moduleIdentifier!] = {
        ects: assessedModule.ects,
        grade: i.grade,
      };
    }
    return acc;
  }, {});

  const averageGrade = getBachelorsGrade(Object.values(gradeInputModules));

  return {
    modules: modulesTakenByUser,
    averageGrade,
  };
}
