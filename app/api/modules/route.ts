import { AppDataSource, connectToDatabase } from "@/backend/datasource";
import { Module } from "@/backend/entities/module.entity";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const modulesRepository = AppDataSource.getRepository(Module);

  const modules = await modulesRepository.find();

  const res = NextResponse.json({
    modules,
  });
  return res;
}
