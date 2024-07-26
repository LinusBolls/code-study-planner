import { CompulsoryElectivePairingDTO } from "@/backend/dtos/compulsory-elective-pairing.dto";
import { ModulesRecordDTO } from "@/backend/dtos/semester.dto";
import { StudyPlanDTO } from "@/backend/dtos/study-plan.dto";
import { Module } from "@/backend/entities/module.entity";

export class StudyPlannerApiClient {
  constructor(
    private readonly accessToken: string,
    private readonly url = "/api",
  ) {
    this.url = "/api";
  }

  public async getModules(): Promise<{
    modules: Module[];
    compulsoryElective: CompulsoryElectivePairingDTO[];
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

  public async getStudyPlan(): Promise<StudyPlanDTO> {
    const res = await fetch(this.url + "/study-plan", {
      headers: {
        "Content-Type": "application/json",
        Authorization: this.accessToken,
      },
    });
    const data: StudyPlanDTO = await res.json();

    return data;
  }

  public async putStudyPlanScope(): Promise<boolean> {
    const res = await fetch(this.url + "/study-plan", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.accessToken,
      },
    });

    const data: boolean = await res.json();

    return data;
  }

  public async updateSemesterModules(
    body: UpdateSemesterModuleInput,
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
      },
    );
    const data: {} = await res.json();

    return data;
  }
}

export type UpdateSemesterModuleInput = Record<string, ModulesRecordDTO>;

export type SemesterModuleCategory =
  | "earlyAssessments"
  | "standardAssessments"
  | "alternativeAssessments"
  | "reassessments";
