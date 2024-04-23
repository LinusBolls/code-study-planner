import { useQuery } from "@tanstack/react-query";
import { QueryRes } from "code-university";
import { useLearningPlatform } from "../useLearningPlatform";
import { readFromCache } from "@/services/caching";

export const useLearningPlatformSemesters = (limit = 20, offset = 0) => {
  const { learningPlatform, enabled } = useLearningPlatform();

  return useQuery<QueryRes<"semesters">>({
    queryFn: async () => {
      const data = await learningPlatform!.raw.query(
        useLearningPlatformSemestersQuery,
        {
          pagination: {
            limit,
            offset,
          },
        }
      );
      return data;
    },
    queryKey: ["learningPlatform", "semesters"],
    enabled,
    initialData: readFromCache(["learningPlatform", "semesesters"]),
  });
};

export const useLearningPlatformSemestersQuery = `query allSemesters($pagination: OffsetPaginationInput) {
  semesters(pagination: $pagination) {
      id
      name
      startDate
      isActive
      moduleStandardRegistrationStartDate
      moduleStandardRegistrationEndDate
      moduleAlternativeRegistrationStartDate
      moduleAlternativeRegistrationEndDate
      moduleEarlyRegistrationStartDate
      moduleEarlyRegistrationEndDate
      moduleReassessmentRegistrationPhaseStartDate
      moduleReassessmentRegistrationPhaseEndDate
  }
}`;
