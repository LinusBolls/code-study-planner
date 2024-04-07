import { StudyPlannerApiClient } from ".";

export default function useSession() {
  const api = new StudyPlannerApiClient(
    localStorage.getItem("study-planner:session")!
  );

  return {
    api,
    enabled: true,
  };
}
