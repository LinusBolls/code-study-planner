import { useQuery } from "@tanstack/react-query";
import { QueryRes } from "code-university";
import { useLearningPlatform } from "../useLearningPlatform";

/**
 * used by the Learning Platform
 */
export const useLearningPlatformCurrentUser = () => {
  const { learningPlatform, enabled } = useLearningPlatform();

  return useQuery<QueryRes<"me">>({
    queryFn: async () => {
      const data = await learningPlatform!.raw.query(`query currentUser {
        me {
          id
          firstName
          lastName
          name
          email
          avatarUrl
          role
          grants
          mandatoryModules
          permissions
          userEventStreamLink
          __typename
        }
        underMaintanance
      }`);
      return data;
    },
    queryKey: ["learningPlatform", "currentUser"],
    enabled,
  });
};
