import { AppDataSource } from "../datasource";
import { Semester } from "../entities/semester.entity";

export async function getSemesterByStudyPlanId(studyPlanId: string) {
  try {
    const semesterRepository = AppDataSource.getRepository(Semester);

    return await semesterRepository.find({
      where: {
        studyPlan: {
          id: studyPlanId,
        },
      },
      relations: ["semesterModules", "semesterModules.module"],
    });
  } catch (error) {
    console.error("GetSemesterByCollab: ", error);

    return [];
  }
}
