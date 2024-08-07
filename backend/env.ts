export const assertString = (value: unknown, name: string) => {
  if (typeof value !== "string") {
    throw new Error(`Invalid ${name}`);
  }
  return value;
};

export const env = {
  isDevelopment: process.env.NODE_ENV === "development",
  publicAppUrl: assertString(process.env.PUBLIC_APP_URL, "PUBLIC_APP_URL"),
  db: {
    host: assertString(process.env.DB_HOST, "DB_HOST"),
    port: parseInt(assertString(process.env.DB_PORT, "DB_PORT"), 10),
    name: assertString(process.env.DB_NAME, "DB_NAME"),
    username: assertString(process.env.DB_USERNAME, "DB_USERNAME"),
    password: assertString(process.env.DB_PASSWORD, "DB_PASSWORD"),
  },
  auth: {
    accessToken: {
      secret: assertString(
        process.env.ACCESS_TOKEN_SECRET,
        "ACCESS_TOKEN_SECRET",
      ),
    },
  },
  lp: {
    accessToken: process.env.LP_ACCESS_TOKEN,
  },
  sentry: {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
};
