import { useQuery } from "@tanstack/react-query";
import { LP } from "code-university";
import { useLearningPlatform } from "../useLearningPlatform";
import { readFromCache } from "@/services/caching";

export const useLearningPlatformSemesterModules = (
  semesterModuleIds: string[]
) => {
  const { learningPlatform, enabled } = useLearningPlatform();

  return useQuery<{ semesterModules: LP.SemesterModule[] }>({
    queryFn: async () => {
      let semesterModules: LP.SemesterModule[] = [];

      for (const semesterModuleId of semesterModuleIds) {
        const result = await learningPlatform!.raw.query<"semesterModule">(
          query,
          { semesterModuleId }
        );
        if (result.semesterModule) semesterModules.push(result.semesterModule);
      }
      return { semesterModules };
    },
    queryKey: [
      "learningPlatform",
      "semesterModules",
      semesterModuleIds.join("+"),
    ],
    enabled,
    initialData: readFromCache([
      "learningPlatform",
      "semesterModules",
      semesterModuleIds.join("+"),
    ]),
  });
};

const query = `query customSemesterModule($semesterModuleId: ID!) {
  semesterModule(semesterModuleId: $semesterModuleId) {
    id
    status
    highestGrade
    currentAssessment {
      assessmentStyle
      proposalText
      examinationForms
      __typename
    }
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
}`;
