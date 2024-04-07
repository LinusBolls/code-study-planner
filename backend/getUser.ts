import { NextRequest } from "next/server";
import { AppDataSource, connectToDatabase } from "./datasource";
import { User } from "./entities/user.entity";
import { verifyAccessToken } from "@/app/api/auth/login/route";

export async function getUser(req: NextRequest): Promise<User | null> {
  await connectToDatabase();

  try {
    // const accessToken = req.cookies.get("authorization")?.value;
    const accessToken = req.headers.get("authorization");

    const payload = await verifyAccessToken(accessToken!);

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { id: payload.sub } });

    return user;
  } catch (err) {
    return null;
  }
}
