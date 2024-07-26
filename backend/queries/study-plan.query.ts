import { AppDataSource } from "../datasource";
import { StudyPlanUpdateScopeDTO } from "../dtos/study-plan.dto";
import { StudyPlan } from "../entities/studyPlan.entity";
import { CollaboratorRole } from "../entities/studyPlanCollaborator.entity";

export async function updateStudyPlanScopeByCollabId(
  collabId: string,
  body: StudyPlanUpdateScopeDTO,
): Promise<StudyPlan | null> {
  try {
    const studyPlanRepository = AppDataSource.getRepository(StudyPlan);

    const studyPlan = await getStudyPlanByCollaboratorId(collabId);

    if (!studyPlan) return null;

    studyPlan.scope = body.scope;

    await studyPlanRepository.save(studyPlan);

    return studyPlan;
  } catch (error) {
    console.error("UpdateStudyPlanScope: ", error);

    return null;
  }
}

export async function getStudyPlanByCollaboratorId(collabId: string) {
  try {
    const studyPlanRepository = AppDataSource.getRepository(StudyPlan);

    return await studyPlanRepository.findOne({
      where: {
        studyPlanCollaborator: {
          hasAccepted: true,
          role: CollaboratorRole.Owner,
          id: collabId,
        },
      },
    });
  } catch (error) {
    console.error("GetStudyPlanByCollaboratorId: ", error);

    return null;
  }
}
