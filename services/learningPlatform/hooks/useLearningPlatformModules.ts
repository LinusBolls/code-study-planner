import { useQuery } from "@tanstack/react-query";
import { QueryRes } from "code-university";

import { isDefined } from "../util/isDefined";
import consumePaginatedQuery from "../consumePaginatedQuery";
import { useLearningPlatform } from "../useLearningPlatform";
import { readFromCache } from "@/services/caching";

export const useLearningPlatformModules = () => {
  const { learningPlatform, enabled } = useLearningPlatform();

  return useQuery<QueryRes<"currentSemesterModules">>({
    queryFn: async () => {
      const { currentSemesterModulesCount } = await learningPlatform!.raw
        .query<"currentSemesterModulesCount">(`
        query {
          currentSemesterModulesCount
        }`);
      const modulesPerQuery = 100;

      const results = await consumePaginatedQuery(
        (pagination) =>
          learningPlatform!.raw.query<"currentSemesterModules">(
            learningPlatformModulesQuery,
            {
              pagination,
              filter: {},
            }
          ),
        currentSemesterModulesCount,
        modulesPerQuery
      );

      const currentSemesterModules = results.flatMap(
        (i) => i.currentSemesterModules
      );

      return {
        currentSemesterModules: currentSemesterModules.filter(isDefined),
      };
    },
    queryKey: ["learningPlatform", "modules"],
    enabled,
    initialData: readFromCache(["learningPlatform", "modules"]),
  });
};

export const learningPlatformModulesQuery = `query semesterModuleAllModules($pagination: OffsetPaginationInput, $filter: SemesterModuleFilter) {
  currentSemesterModules(pagination: $pagination, filter: $filter) {
    __typename
    ...SemesterModuleListCard
  }
  coordinatorUsers {
    ...UserListItem
    __typename
  }
  currentSemesterModulesCount(filter: $filter)
}

fragment SemesterModuleListCard on ViewerSemesterModule {
  __typename
  ...TakenSemesterModule
  ...CoordinatedSemesterModule
  ...UnassociatedSemesterModule
}

fragment TakenSemesterModule on ViewerTakenSemesterModule {
  ...SemesterModuleFrame
  status
  highestGrade
  latestAssessment {
    id
    publishedAt
    learningUnit {
      id
      title
      __typename
    }
    __typename
  }
  currentAssessment {
    id
    __typename
  }
  primaryAssessor {
    id
    name
    __typename
  }
  __typename
}

fragment SemesterModuleFrame on ViewerSemesterModule {
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

fragment CoordinatedSemesterModule on ViewerCoordinatedSemesterModule {
  ...SemesterModuleFrame
  openProposalsCount
  openAssessmentsCount
  __typename
}

fragment UnassociatedSemesterModule on ViewerSemesterModule {
  ...SemesterModuleFrame
  __typename
}

fragment UserListItem on User {
  id
  firstName
  lastName
  name
  email
  inactive
  role
  slackLink
  skills {
    id
    isHighlighted
    skill {
      name
      __typename
    }
    __typename
  }
  avatarUrl
  __typename
}`;
