import { useMutation, useQueryClient } from "@tanstack/react-query";

import { StudyPlanDTO } from "@/backend/dtos/study-plan.dto";
import { useMessages } from "@/components/util/useMessages";

import { StudyPlannerApiClient } from "..";
import useSession from "../useSession";

export const useUpdateSemesterModule = () => {
  const { api } = useSession();

  const queryClient = useQueryClient();

  const { showErrorMessage } = useMessages();

  return useMutation({
    mutationFn:
      api?.updateSemesterModules.bind<
        StudyPlannerApiClient["updateSemesterModules"]
      >(api),
    mutationKey: ["studyPlanner", "studyPlan"],
    onMutate(variables) {
      const prev = queryClient.getQueryData<StudyPlanDTO>([
        "studyPlanner",
        "studyPlan",
      ]);
      if (!prev) return;

      for (const semester of prev.semesters) {
        semester.modules = variables[semester.id];
      }
      queryClient.setQueryData(["studyPlanner", "studyPlan"], prev);
    },
    onError(error, variables, context) {
      // TODO: rollback the optimistic update
      showErrorMessage("Failed to update study plan");
    },
    retry: 2,
  });
};
