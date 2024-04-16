import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSession from "../useSession";
import { StudyPlan, StudyPlannerApiClient } from "..";

export const useUpdateSemesterModule = () => {
  const { api } = useSession();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn:
      api?.updateSemesterModules.bind<
        StudyPlannerApiClient["updateSemesterModules"]
      >(api),
    mutationKey: ["studyPlanner", "studyPlan"],
    onMutate(variables) {
      const prev: StudyPlan = queryClient.getQueryData([
        "studyPlanner",
        "studyPlan",
      ])!;
      for (const semester of prev.semesters) {
        semester.modules = variables[semester.id];
      }
      queryClient.setQueryData(["studyPlanner", "studyPlan"], prev);
    },
    onError(error, variables, context) {
      // TODO: rollback the optimistic update
    },
  });
};
