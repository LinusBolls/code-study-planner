import { useQuery } from "@tanstack/react-query";
import { QueryRes } from "code-university";
import { useLearningPlatform } from "../useLearningPlatform";

/**
 * used by the `My Studies` tab on the `Modules` tab of the Learning Platform
 */
export const useLearningPlatformMyStudies = () => {
  const { learningPlatform, enabled } = useLearningPlatform();

  return useQuery<QueryRes<"myStudies">>({
    queryFn: async () => {
      const data = await learningPlatform!.raw.query(
        useLearningPlatformMyStudiesQuery
      );
      return data;
    },
    queryKey: ["learningPlatform", "myStudies"],
    enabled,
  });
};

export const useLearningPlatformMyStudiesQuery = `query myStudies($filter: ModuleFilter) {
  myStudies(filter: $filter) {
    ...myStudies
    __typename
  }
  coordinatorUsers {
    ...UserListItem
    __typename
  }
}

fragment myStudies on MyStudiesModule {
  id
  simpleShortCode
  status
  title
  coordinator {
    id
    name
    __typename
  }
  moduleType
  moduleIdentifier
  ...Assessments
  __typename
}

fragment Assessments on MyStudiesModule {
  assessments {
    # this is new
    semester {
      id
      name
    }
    assessmentStyle
    submittedOn
    # / this is new
    id
    proposalStatus
    assessor {
      id
      name
      __typename
    }
    grade
    externalFeedback
    assessmentType
    assessmentStatus
    event {
      id
      startTime
      createdAt
      __typename
    }
    createdAt
    semesterModule {
      id
      module {
        id
        title
        shortCode
        __typename
      }
      __typename
    }
    __typename
  }
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
}
`;
