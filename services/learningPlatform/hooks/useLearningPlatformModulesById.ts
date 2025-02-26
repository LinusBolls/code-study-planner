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
  semesterModules {
      id
  isDraft
  hasDuplicate
  allowsRegistration
  moduleIdentifier
  module {
    id
    title
    shortCode
    simpleShortCode
    retired
    coordinator {
      id
      name
      __typename
    }
    __typename

    # we added these fields
    frequency
    content
    qualificationGoals
    ects
    contactTime
    selfStudyTime
    weeklyHours
    graded
    workload
    prerequisites {
      id
    }
    prerequisiteFor {
      id
    }
    replacements {
      id
      moduleIdentifier
    }
    replacementFor {
      id
      moduleIdentifier
    }

    department {
      # for use in the search
      name
      # to identify the department
      abbreviation
    }
    semesterModules {
      allowsEarlyAssessment
      disabledAlternativeAssessment
    }
    # /we added these fields
  }
  semester {
    id
    name
    isActive
    __typename
  }
  __typename
  }
  }
}`;
