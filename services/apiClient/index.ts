import { CompulsoryElectivePairing } from "@/backend/entities/compulsoryElectivePairing.entity";
import { Module } from "@/backend/entities/module.entity";

export interface ApiSemesterModule {
  moduleId: string;
}

interface ModulesRecord {
  earlyAssessments: ApiSemesterModule[];
  standartAssessments: ApiSemesterModule[];
  alternativeAssessments: ApiSemesterModule[];
  reassessments: ApiSemesterModule[];
}

export interface StudyPlan {
  semesters: {
    id: string;
    lpId: string | null;
    startDate: string;
    modules: ModulesRecord;
  }[];
}

export class StudyPlannerApiClient {
  constructor(
    private readonly accessToken: string,
    private readonly url = "/api"
  ) {
    this.url = "/api";
  }

  public async getModules(): Promise<{
    modules: Module[];
    compulsoryElective: CompulsoryElectivePairing[];
  }> {
    const res = await fetch(this.url + "/modules", {
      headers: {
        "Content-Type": "application/json",
        Authorization: this.accessToken,
      },
    });
    const data = await res.json();

    return data;
  }

  public async getStudyPlan(): Promise<StudyPlan> {
    const res = await fetch(this.url + "/study-plan", {
      headers: {
        "Content-Type": "application/json",
        Authorization: this.accessToken,
      },
    });
    const data: StudyPlan = await res.json();

    return data;
  }

  public async updateSemesterModules(
    body: UpdateSemesterModuleInput
  ): Promise<{}> {
    const res = await fetch(
      this.url + "/study-plan/semester-modules/batch-update",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: this.accessToken,
        },
        method: "PUT",
        body: JSON.stringify(body),
      }
    );
    const data: {} = await res.json();

    return data;
  }
}

export type UpdateSemesterModuleInput = Record<string, ModulesRecord>;

export type SemesterModuleCategory =
  | "earlyAssessments"
  | "standartAssessments"
  | "alternativeAssessments"
  | "reassessments";
