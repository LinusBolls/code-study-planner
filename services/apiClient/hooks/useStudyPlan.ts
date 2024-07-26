import { useQuery } from "@tanstack/react-query";

import useSession from "../useSession";

export const useStudyPlan = () => {
  const { api, enabled } = useSession();

  return useQuery({
    queryFn: api?.getStudyPlan.bind(api),
    queryKey: ["studyPlanner", "studyPlan"],
    enabled,
  });
};
