import * as jose from "jose";

import { User } from "./entities/user.entity";
import { env } from "./env";

export type JwtPayload = {
  sub: string;
  learningPlatformUserId: string;
};

export async function issueAccessToken(user: User): Promise<string> {
  const secret = new TextEncoder().encode(env.auth.accessToken.secret);

  const payload: JwtPayload = {
    sub: user.id,
    learningPlatformUserId: user.lpId,
  };

  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    // .setExpirationTime("2h")
    // .setExpirationTime(Date.now() + Config.accessTokenExpiryMs)
    .sign(secret);

  return jwt;
}

export async function verifyAccessToken(jwt: string): Promise<JwtPayload> {
  const secret = new TextEncoder().encode(env.auth.accessToken.secret);

  const { payload } = await jose.jwtVerify(jwt, secret);

  return payload as JwtPayload;
}
