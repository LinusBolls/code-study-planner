import { useQuery } from "@tanstack/react-query";
import { QueryRes } from "code-university";
import { useLearningPlatform } from "../useLearningPlatform";
import { readFromCache } from "@/services/caching";

export const useLearningPlatformMyModuleData = () => {
  const { learningPlatform, enabled } = useLearningPlatform();

  return useQuery<QueryRes<"myModuleData">>({
    queryFn: async () => {
      const data = await learningPlatform!.raw.query(
        useLearningPlatformMyModuleDataQuery
      );
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
