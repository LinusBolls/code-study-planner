import dayjs from "dayjs";
import { useState } from "react";

import { useLearningPlatformAssessmentTable } from "@/services/learningPlatform/hooks/useLearningPlatformAssessmentTable";
import { useLearningPlatformMyModuleData } from "@/services/learningPlatform/hooks/useLearningPlatformMyModuleData";
import { getBachelorsGrade } from "@/services/learningPlatform/util/getBachelorsGrade";
import { getGradeInfo } from "@/services/learningPlatform/util/getGradeInfo";

import { ECTSPanelProps } from "../ECTSPanel";
import { useSemestersList } from "../SemestersList/useSemestersList";
import { useModulesInScope } from "../util/useModulesInScope";

export function useECTSPanel(): ECTSPanelProps {
  const semestersListQuery = useSemestersList();

  const modulesTakenByUser = semestersListQuery.semesters
    .flatMap((i) => Object.values(i.modules).flat())
    .toSorted(
      (a, b) =>
        (dayjs(a.assessment?.proposedDate).unix() || 0) -
        (dayjs(b.assessment?.proposedDate).unix() || 0),
    );

  const modulesInScopeQuery = useModulesInScope();

  const myModuleDataQuery = useLearningPlatformMyModuleData();

  const assessmentTableQuery = useLearningPlatformAssessmentTable();

  const myAssessments = assessmentTableQuery.data?.myAssessments ?? [];

  const gradeInputModules = myAssessments.reduce<
    Record<string, { ects: number; grade: number }>
  >((acc, i) => {
    const existing = acc[i.semesterModule!.moduleIdentifier!];

    const assessedModule = modulesInScopeQuery.modules.find(
      (j) => j.id === i.semesterModule!.id,
    );

    if (!assessedModule) {
      console.warn(
        "[useECTSPanel] failed to find module for assessment:",
        i.semesterModule!.id,
        i.semesterModule!.moduleIdentifier,
      );
      return acc;
    }

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

  const [previewStudyPlan, setPreviewStudyPlan] = useState(false);

  return {
    myModuleData: myModuleDataQuery.data?.myModuleData,
    modules: modulesTakenByUser,
    averageGrade,
    isLoading:
      semestersListQuery.isLoading ||
      myModuleDataQuery.isLoading ||
      modulesInScopeQuery.isLoading,
    previewStudyPlan,
    onPreviewStudyPlanChange: setPreviewStudyPlan,
  };
}
