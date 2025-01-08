import useSession from "@/services/apiClient/useSession";
import { useLearningPlatformCurrentUser } from "@/services/learningPlatform/hooks/useLearningPlatformCurrentUser";

import { HeaderProps } from ".";

export default function useHeader(): HeaderProps {
  const { api } = useSession();
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

  async function onResetStudyPlan() {
    try {
      await api?.resetStudyPlan();

      location.reload();
    } catch (err) {
      alert((err as Error).message || "Unknown error");
    }
  }

  return {
    isLoading: currentUserQuery.isLoading,
    user,

    onResetStudyPlan,
  };
}
