const hasLocalStorage = typeof window !== "undefined";

export const EXPERIMENTAL_STUDY_PLAN_SHARING =
  hasLocalStorage &&
  localStorage.getItem("experimental:study-plan-sharing") === "true";

  export const EXPERIMENTAL_MODULE_POPOVER = hasLocalStorage &&
  localStorage.getItem("experimental:module-popover") === "true"