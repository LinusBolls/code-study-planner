import { useQuery } from "@tanstack/react-query";
import { QueryRes } from "code-university";
import { useLearningPlatform } from "../useLearningPlatform";
import { readFromCache } from "@/services/caching";

/**
 * used by the `My Studies` tab on the `Modules` tab of the Learning Platform
 */
export const useLearningPlatformMySemesterList = (limit = 20, offset = 0) => {
  const { learningPlatform, enabled } = useLearningPlatform();

  return useQuery<QueryRes<"mySemesterModules"> & QueryRes<"coordinatorUsers">>(
    {
      queryFn: async () => {
        const data = await learningPlatform!.raw.query(
          `query mySemesterList($pagination: OffsetPaginationInput, $filter: SemesterModuleFilter) {
            mySemesterModules(pagination: $pagination, filter: $filter) {
              ...SemesterModuleListCard
              __typename
            }
            coordinatorUsers {
              ...UserListItem
              __typename
            }
            mySemesterModulesCount(filter: $filter)
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
          }`,
          { pagination: { limit, offset } }
        );
        return data;
      },
      queryKey: ["learningPlatform", "mySemesterList"],
      enabled,
      initialData: readFromCache(["learningPlatform", "mySemesterList"]),
    }
  );
};
