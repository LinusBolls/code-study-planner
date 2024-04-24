import { DataSource } from "typeorm";

import "reflect-metadata";
import dataSourceOptions from "@/ormconfig";

export const AppDataSource = new DataSource(dataSourceOptions);

export const connectToDatabase = async () => {
  if (AppDataSource.isInitialized) return;

  try {
    const now = Date.now();
    await AppDataSource.initialize();
    console.info("[connectToDatabase] connected in", Date.now() - now + "ms");
  } catch (err) {
    console.error("[connectToDatabase] failed:", err, dataSourceOptions);
  }
};
