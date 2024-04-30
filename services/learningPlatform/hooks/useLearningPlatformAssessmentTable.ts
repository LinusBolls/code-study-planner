import { useQuery } from "@tanstack/react-query";
import { QueryRes } from "code-university";

import consumePaginatedQuery from "../consumePaginatedQuery";
import { useLearningPlatform } from "../useLearningPlatform";
import { readFromCache } from "@/services/caching";

/**
 * used by the `Assessments` tab of the Learning Platform
 */
export const useLearningPlatformAssessmentTable = () => {
  const { learningPlatform, enabled } = useLearningPlatform();

  return useQuery<QueryRes<"myAssessments">>({
    queryFn: async () => {
      const results = await consumePaginatedQuery(
        (pagination) =>
          learningPlatform!.raw.query<"myAssessments">(query, {
            pagination,
            filter: {},
          }),
        100,
        20
      );
      const myAssessments = results.flatMap((i) => i.myAssessments);

      return {
        myAssessments,
      };
    },
    queryKey: ["learningPlatform", "assessmentTable"],
    enabled,
    initialData: readFromCache(["learningPlatform", "assessmentTable"]),
  });
};

const query = `query AssessmentTable($pagination: OffsetPaginationInput, $filter: AssessmentFilter, $sortKey: String, $deletedOnly: Boolean) {
myAssessments(
    pagination: $pagination
    filter: $filter
    sortKey: $sortKey
    deletedOnly: $deletedOnly
) {
    ...AssessmentTableEntry
    __typename
}
myAssessmentsCount(filter: $filter, deletedOnly: $deletedOnly)
semesters {
    id
    name
    isActive
    __typename
}
modules {
    id
    title
    shortCode
    graded
    __typename
}
projects {
    id
    title
    __typename
}
students {
    id
    name
    __typename
}
}

fragment AssessmentTableEntry on Assessment {
    # this is new
proposedDate
# / this is new
id
published
readyForPublishing
updatedAt
submittedOn
user {
    id
    firstName
    lastName
    name
    avatarUrl
    __typename
}
semester {
    id
    name
    __typename
}
project {
    id
    title
    __typename
}
learningUnit {
    id
    title
    __typename
}
userHandins {
    id
    handin {
    title
    __typename
    }
    __typename
}
semesterModule {
    ...SemesterModuleLink
    __typename
}
event {
    id
    startTime
    endTime
    location
    remoteLocation
    __typename
}
workflowStatus
proposalStatus
proposalText
examinationForms
assessmentStatus
assistant {
    id
    name
    __typename
}
assessmentType
assessmentStyle
assessor {
    id
    name
    avatarUrl
    firstName
    __typename
}
grade
manageStatus
module {
    id
    title
    shortCode
    simpleShortCode
    graded
    __typename
}
externalFeedback
internalNotes
examinationOfficeNotes
__typename
}

fragment SemesterModuleLink on SemesterModule {
id
semester {
    name
    id
    isActive
    __typename
}
module {
    ...SimpleModuleSummary
    __typename
}
moduleIdentifier
__typename
}

fragment SimpleModuleSummary on Module {
id
title
simpleShortCode
shortCode
graded
coordinator {
    id
    name
    __typename
}
__typename
}`;
