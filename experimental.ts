const hasLocalStorage = typeof window !== "undefined";

export const EXPERIMENTAL_STUDY_PLAN_SHARING =
  hasLocalStorage &&
  localStorage.getItem("experimental:study-plan-sharing") === "true";
