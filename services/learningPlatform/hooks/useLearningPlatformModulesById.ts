import { useQuery } from "@tanstack/react-query";
import { LP } from "code-university";

import { readFromCache } from "@/services/caching";

import { useLearningPlatform } from "../useLearningPlatform";

export const useLearningPlatformModulesById = (moduleIds: string[]) => {
  const { learningPlatform, enabled } = useLearningPlatform();

  return useQuery<{ modules: LP.Module[] }>({
    queryFn: async () => {
      let modules: LP.Module[] = [];

      for (const moduleId of moduleIds) {
        const result = await learningPlatform!.raw.query<"module">(query, {
          moduleId,
        });
        if (result.module) modules.push(result.module);
      }
      return { modules };
    },
    queryKey: ["learningPlatform", "modulesById", moduleIds.join("+")],
    enabled,
    initialData: readFromCache([
      "learningPlatform",
      "modulesById",
      moduleIds.join("+"),
    ]),
  });
};

const query = `query customModule($moduleId: ID!) {
  module(moduleId: $moduleId) {
    id
    moduleIdentifier
    shortCode
  }
}`;
