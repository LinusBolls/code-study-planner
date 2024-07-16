const hasLocalStorage = typeof window !== "undefined";

export const EXPERIMENTAL_STUDY_PLAN_SHARING =
  hasLocalStorage &&
  localStorage.getItem("experimental:study-plan-sharing") === "true";

export const EXPERIMENTAL_GOOGLE_AUTH =
  (hasLocalStorage &&
    localStorage.getItem("experimental:google-auth") === "true") ||
  true;
