import { AppDataSource } from "../datasource";
import { StudyPlanPutDTO } from "../dtos/study-plan.dto";
import { CollaboratorRole } from "../entities/enums";
import { StudyPlan } from "../entities/studyPlan.entity";

export async function updateStudyPlanScopeByCollabId(
  collabId: string,
  body: StudyPlanPutDTO,
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
        studyPlanCollaborators: {
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
