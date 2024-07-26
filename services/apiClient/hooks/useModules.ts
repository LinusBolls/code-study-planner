import { useQuery } from "@tanstack/react-query";

import useSession from "../useSession";

export const useModules = () => {
  const { api, enabled } = useSession();

  return useQuery({
    queryFn: api?.getModules.bind(api),
    queryKey: ["studyPlanner", "modules"],
    enabled,
  });
};
