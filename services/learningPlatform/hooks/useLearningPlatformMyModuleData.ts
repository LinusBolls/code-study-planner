import { useQuery } from "@tanstack/react-query";
import { QueryRes } from "code-university";

import { readFromCache } from "@/services/caching";

import { useLearningPlatform } from "../useLearningPlatform";

/**
 * used by the `My ECTS by Module Type` section on the `Dashboard` tab of the Learning Platform
 */
export const useLearningPlatformMyModuleData = () => {
  const { learningPlatform, enabled } = useLearningPlatform();

  return useQuery<QueryRes<"myModuleData" | "studyPathReport">>({
    queryFn: async () => {
      const data = await learningPlatform!.raw.query<
        "myModuleData" | "studyPathReport"
      >(useLearningPlatformMyModuleDataQuery);
      return data;
    },
    queryKey: ["learningPlatform", "myModuleData"],
    enabled,
    initialData: readFromCache(["learningPlatform", "myModuleData"]),
  });
};

export const useLearningPlatformMyModuleDataQuery = `query myModuleData {
    myModuleData {
      capstone {
        ...MyECTSStatsData
        __typename
      }
      thesis {
        ...MyECTSStatsData
        __typename
      }
      sts {
        ...MyECTSStatsData
        __typename
      }
      orientation {
        ...MyECTSStatsData
        __typename
      }
      mandatory {
        ...MyECTSStatsData
        __typename
      }
      compulsoryElective {
        ...MyECTSStatsData
        __typename
      }
      elective {
        ...MyECTSStatsData
        __typename
      }
      __typename
    }
  }
  
  fragment MyECTSStatsData on MyECTSStats {
    collectedECTS
    totalECTSNeeded
    __typename
  }`;

// this query used to be fine, but now returns an "Unauthorised" error
// studyPathReport {
//   user
//   modules
//   ects
//   handbook
//   semesterNumber
//   __typename
// }
