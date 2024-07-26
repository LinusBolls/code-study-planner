import { Module } from "../entities/module.entity";

export interface ModuleDTO
  extends Omit<
    Module,
    "createdAt" | "updatedAt" | "compulsoryElectivePairings"
  > {}
