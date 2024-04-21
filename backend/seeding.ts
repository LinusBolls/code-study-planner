/**
 * this is a seperate script and not a part of the backend server.
 *
 * this is intended to be run when the database is empty to seed it with data.
 * fetches data about study programs, module handbooks and modules from the learning platform and stores it in the database.
 */

import { LearningPlatformClient } from "code-university";
import { AppDataSource, connectToDatabase } from "./datasource";
import {
  StudyProgram,
  StudyProgramAbbreviation,
} from "./entities/studyProgram.entity";
import { ModuleHandbook } from "./entities/moduleHandbook.entity";
import { Module } from "./entities/module.entity";
import { CompulsoryElectivePairing } from "./entities/compulsoryElectivePairing.entity";
import { env } from "./env";
import { learningPlatformModulesQuery } from "@/services/learningPlatform/hooks/useLearningPlatformModules";
import consumePaginatedQuery from "@/services/learningPlatform/consumePaginatedQuery";
import { isDefined } from "@/services/learningPlatform/util/isDefined";

if (!env.lp.accessToken) {
  throw new Error(
    "FATAL the 'LP_ACCESS_TOKEN' environment variable is required to run the seeding script"
  );
}

const moduleMeta: Record<string, { proficiency: number }> = {
  IS_01: { proficiency: 0 },
  IS_02: { proficiency: 0 },

  PM_11: { proficiency: 0 },
  PM_21: { proficiency: 0 },
  PM_22: { proficiency: 0 },
  PM_24: { proficiency: 0 },
  PM_25: { proficiency: 0 },
  PM_27: { proficiency: 0 },
  PM_28: { proficiency: 0 },

  SE_01: { proficiency: 0 }, // software development basics
  SE_02: { proficiency: 0 }, // algorithms and data structures
  SE_03: { proficiency: 2 }, // concepts of programming languages
  SE_04: { proficiency: 3 }, // network programming
  SE_05: { proficiency: 1 }, // relational databases
  SE_06: { proficiency: 1 }, // nosql databases
  SE_07: { proficiency: 2 }, // collaboration
  SE_08: { proficiency: 1 }, // clean code
  SE_09: { proficiency: 3 }, // cyber security
  SE_10: { proficiency: 1 }, // automated software testing

  SE_19: { proficiency: 1 }, // web technologies basics

  SE_35: { proficiency: 4 }, // software modeling and design patterns

  SE_41: { proficiency: 0 }, // digital fabrication
  SE_45: { proficiency: 2 }, // web frontend technologies
  SE_46: { proficiency: 2 }, // web backend technologies
};

const compulsoryElectivePairings: {
  department: string;
  handbookVersions: number[];
  modules: string[];
}[] = [
  {
    department: "SE",
    handbookVersions: [2, 2.2, 3],
    modules: ["SE_05", "SE_06"],
  },

  {
    department: "SE",
    handbookVersions: [2, 2.2, 3],
    modules: ["IS_01", "IS_02"],
  },

  {
    department: "SE",
    handbookVersions: [3],
    modules: ["PM_24", "PM_27", "PM_28"],
  },

  {
    department: "ID",
    handbookVersions: [/** 2? 2.2? */ 3],
    modules: ["pm_11", "pm_21", "pm_22", "pm_24", "pm_25"],
  },
  {
    department: "ID",
    handbookVersions: [/** 2? 2.2? */ 3],
    modules: ["se_01", "se_02", "se_19", "se_41", "se_45"],
  },
  // PM v3 doesn't have any
];

const getAbbreviation = (name: string) => {
  if (name === "BSc SE") return StudyProgramAbbreviation.SE;
  if (name === "BA ID") return StudyProgramAbbreviation.ID;
  if (name === "BA PM") return StudyProgramAbbreviation.PM;

  throw new Error(
    "[getAbbreviation] failed to resolve study program abbreviation: " + name
  );
};

async function clearDatabase() {
  const runner = AppDataSource.createQueryRunner();

  await runner.connect();
  await runner.startTransaction();

  const disableForeignKeyChecks = "SET session_replication_role = replica;";
  const enableForeignKeyChecks = "SET session_replication_role = DEFAULT;";

  try {
    await runner.query(disableForeignKeyChecks);

    for (const metadata of AppDataSource.entityMetadatas) {
      await runner.query(`DELETE FROM "${metadata.tableName}";`);
    }
    await runner.query(enableForeignKeyChecks);

    await runner.commitTransaction();

    console.info("deleted existing data");
  } catch (err) {
    console.error("failed to delete existing data:", err);
    await runner.rollbackTransaction();
  } finally {
    await runner.release();
  }
}

async function main() {
  await connectToDatabase();

  await clearDatabase();

  const studyProgramRepository = AppDataSource.getRepository(StudyProgram);
  const moduleHandbookRepository = AppDataSource.getRepository(ModuleHandbook);
  const moduleRepository = AppDataSource.getRepository(Module);
  const compulsoryElectivePairingRepository = AppDataSource.getRepository(
    CompulsoryElectivePairing
  );

  const learningPlatform = await LearningPlatformClient.fromAccessToken(
    env.lp.accessToken!
  );

  const studyPrograms = await learningPlatform.raw
    .query<"studyPrograms">(`query allStudyPrograms {
    studyPrograms {
        id
        name
        abbreviation
        moduleHandbooks {
          id  
          name
          validFrom
        }
    }
}`);

  const { currentSemesterModulesCount } = await learningPlatform!.raw
    .query<"currentSemesterModulesCount">(`
query {
  currentSemesterModulesCount
}`);
  const modulesPerQuery = 100;

  console.info(`fetched ${studyPrograms.studyPrograms.length} study programs`);

  const results = await consumePaginatedQuery(
    (pagination) =>
      learningPlatform!.raw.query<"currentSemesterModules">(
        learningPlatformModulesQuery,
        {
          pagination,
          filter: {},
        }
      ),
    currentSemesterModulesCount,
    modulesPerQuery
  );

  const currentSemesterModules = results
    .flatMap((i) => i.currentSemesterModules)
    .filter(isDefined);

  console.info(`fetched ${currentSemesterModules.length} modules`);

  let savedModuleHandbooks: ModuleHandbook[] = [];
  let savedStudyPrograms: StudyProgram[] = [];
  let savedModules: Module[] = [];
  let savedCompulsoryElectivePairings: CompulsoryElectivePairing[] = [];

  for (const studyProgram of studyPrograms.studyPrograms) {
    const abbreviation = getAbbreviation(studyProgram.abbreviation);

    const studyProgramEntity = await studyProgramRepository.save(
      studyProgramRepository.create({
        lpId: studyProgram.id,
        abbreviation,
      })
    );
    savedStudyPrograms.push(studyProgramEntity);

    for (const handbook of studyProgram.moduleHandbooks!) {
      const [name, degree, department, version] =
        handbook.name.match(/(BA|BSc)_(SE|ID|PM)_v(\d+)/) ?? [];

      savedModuleHandbooks.push(
        await moduleHandbookRepository.save(
          moduleHandbookRepository.create({
            lpId: handbook.id,
            studyProgramId: studyProgramEntity.id,
          })
        )
      );
    }
  }

  for (const currentModule of currentSemesterModules) {
    const meta =
      moduleMeta[currentModule.moduleIdentifier as keyof typeof moduleMeta];

    if (meta) {
      savedModules.push(
        await moduleRepository.save(
          moduleRepository.create({
            lpId: currentModule.id,
            proficiency: meta.proficiency,
            possiblyOutdated: false,
            moduleIdentifier: currentModule.moduleIdentifier!,
          })
        )
      );
    }
  }
  for (const pairing of compulsoryElectivePairings) {
    const handbook = savedModuleHandbooks.find((i) => i);

    const modules = savedModules.filter((i) =>
      pairing.modules.includes(i.moduleIdentifier)
    );

    if (!handbook) {
      throw new Error(
        "failed to find handbook or study program for compulsory elective pairing: " +
          JSON.stringify(pairing, null, 2)
      );
    }
    savedCompulsoryElectivePairings.push(
      await compulsoryElectivePairingRepository.save(
        compulsoryElectivePairingRepository.create({
          moduleHandbookId: handbook.id,
          modules,
        })
      )
    );
  }

  console.info("finished seeding:");
  console.info(savedStudyPrograms.length, "study programs");
  console.info(savedModuleHandbooks.length, "module handbooks");
  console.info(savedModules.length, "modules");
  console.info(
    savedCompulsoryElectivePairings.length,
    "compulsory elective pairings"
  );

  AppDataSource.destroy();
}
main();
