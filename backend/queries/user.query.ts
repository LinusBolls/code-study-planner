import { AppDataSource } from "../datasource";
import { User } from "../entities/user.entity";

export async function getUserByLpId(lpId: string) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    return await userRepository.findOne({
      where: {
        lpId,
      },
    });
  } catch (error) {
    console.error("getUserByLpId: ", error);

    return null;
  }
}
