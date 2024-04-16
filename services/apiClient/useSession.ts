import { StudyPlannerApiClient } from ".";

export default function useSession() {
  const sessionToken =
    typeof localStorage === "undefined"
      ? null
      : localStorage.getItem("study-planner:session")!;

  const enabled = sessionToken != null;

  const api = enabled ? new StudyPlannerApiClient(sessionToken) : null;

  return {
    api,
    enabled,
  };
}
