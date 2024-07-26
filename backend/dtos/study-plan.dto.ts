import { StudyPlan } from "../entities/studyPlan.entity";
import { SemesterDTO } from "./semester.dto";
import { StudyPlanCollaboratorDTO } from "./study-plan-collaborator.dto";

export interface StudyPlanDTO
  extends Omit<
    StudyPlan,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "moduleHandbook"
    | "moduleHandbookId"
    | "semesters"
    | "studyPlanCollaborator"
  > {
  semesters: SemesterDTO[];
  studyPlanCollaborator: StudyPlanCollaboratorDTO[];
}
