import { CompulsoryElectivePairingDTO } from "@/backend/dtos/compulsory-elective-pairing.dto";
import { SemesterModulePutDTO } from "@/backend/dtos/semester-module.dto";
import { StudyPlanDTO, StudyPlanPutDTO } from "@/backend/dtos/study-plan.dto";
import { Module } from "@/backend/entities/module.entity";

type SuccessResponse = {
  ok: boolean;
};

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
    //TODO: need to be added as a parameter (currently issue with the hooks), currently not used in backend either
    const studyPlanId = "foo";
    const res = await fetch(this.url + "/study-plan/" + studyPlanId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: this.accessToken,
      },
    });
    const data: StudyPlanDTO = await res.json();

    return data;
  }

  public async putStudyPlanScope(
    body: StudyPlanPutDTO,
    studyPlanId = "foo",
  ): Promise<SuccessResponse> {
    const res = await fetch(this.url + "/study-plan/" + studyPlanId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: this.accessToken,
      },
    });

    const data: SuccessResponse = await res.json();

    return data;
  }

  public async updateSemesterModules(
    body: SemesterModulePutDTO,
    //studyPlanId: string
  ): Promise<SuccessResponse> {
    //TODO: need to be added as a parameter (currently issue with the hooks), currently not used in backend either
    const studyPlanId = "foo";
    const res = await fetch(
      this.url +
        "/study-plan/" +
        studyPlanId +
        "/semester-modules/batch-update",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: this.accessToken,
        },
        method: "PUT",
        body: JSON.stringify(body),
      },
    );
    const data: SuccessResponse = await res.json();

    return data;
  }
}

export type SemesterModuleCategory =
  | "earlyAssessments"
  | "standardAssessments"
  | "alternativeAssessments"
  | "reassessments";
