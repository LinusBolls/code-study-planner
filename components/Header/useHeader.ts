import { useLearningPlatformCurrentUser } from "@/services/learningPlatform/hooks/useLearningPlatformCurrentUser";
import { HeaderProps } from ".";

export default function useHeader(): HeaderProps {
  const currentUserQuery = useLearningPlatformCurrentUser();

  const avatarUrl = currentUserQuery.data?.me.avatarUrl;
  const firstName = currentUserQuery.data?.me.firstName;
  const lastName = currentUserQuery.data?.me.lastName;

  const username = firstName + " " + lastName;

  return {
    isLoading: currentUserQuery.isLoading,
    username,
    avatarUrl,
  };
}
