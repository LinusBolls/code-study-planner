import { useLearningPlatformCurrentUser } from "@/services/learningPlatform/hooks/useLearningPlatformCurrentUser";

import { HeaderProps } from ".";

export default function useHeader(): HeaderProps {
  const currentUserQuery = useLearningPlatformCurrentUser();

  const avatarUrl = currentUserQuery.data?.me.avatarUrl;
  const firstName = currentUserQuery.data?.me.firstName;
  const lastName = currentUserQuery.data?.me.lastName;

  const username =
    firstName || lastName
      ? (firstName ?? "") + " " + (lastName ?? "")
      : "Unknown User";

  const user = currentUserQuery.isSuccess
    ? {
        avatarUrl: avatarUrl!,
        username,
      }
    : null;

  return {
    isLoading: currentUserQuery.isLoading,
    user,
  };
}
