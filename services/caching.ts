import { Query, QueryKey } from "@tanstack/react-query";

export const writeToCache = (
  data: unknown,
  query: Query<unknown, unknown, unknown, QueryKey>
) => {
  if (query.queryKey[0] === "learningPlatform") {
    localStorage.setItem(
      "cache:" + query.queryKey.join("-"),
      JSON.stringify(data)
    );
  }
};

export const readFromCache = (queryKey: string[]) => {
  return JSON.parse(
    localStorage.getItem("cache:" + queryKey.join("-")) ?? "null"
  );
};
