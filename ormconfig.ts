import { DataSourceOptions } from "typeorm";
import { env } from "./backend/env";
import { Module } from "./backend/entities/module.entity";
import { Semester } from "./backend/entities/semester.entity";
import { SemesterModule } from "./backend/entities/semesterModule.entity";
import { User } from "./backend/entities/user.entity";
import { StudyPlan } from "./backend/entities/studyPlan.entity";
import { StudyProgram } from "./backend/entities/studyProgram.entity";
import { ModuleHandbook } from "./backend/entities/moduleHandbook.entity";
import { CompulsoryElectivePairing } from "./backend/entities/compulsoryElectivePairing.entity";

const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.name,
  synchronize: env.isDevelopment,
  logging: false,
  entities: [
    Module,
    Semester,
    SemesterModule,
    User,
    StudyPlan,
    StudyProgram,
    ModuleHandbook,
    CompulsoryElectivePairing,
  ],
  subscribers: [],
  migrations: [],
};
export default dataSourceOptions;
