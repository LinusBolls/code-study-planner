import { NextRequest, NextResponse } from "next/server";

import { AppDataSource, connectToDatabase } from "@/backend/datasource";
import { CompulsoryElectivePairing } from "@/backend/entities/compulsoryElectivePairing.entity";
import { Module } from "@/backend/entities/module.entity";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const modulesRepository = AppDataSource.getRepository(Module);
  const compulsoryElectiveRepository = AppDataSource.getRepository(
    CompulsoryElectivePairing,
  );

  const modules = await modulesRepository.find();
  const compulsoryElective = await compulsoryElectiveRepository.find({
    relations: ["modules"],
  });

  const res = NextResponse.json({
    modules,
    compulsoryElective,
  });
  return res;
}
