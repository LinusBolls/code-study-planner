import { CompulsoryElectivePairing } from "../entities/compulsoryElectivePairing.entity";
import { ModuleDTO } from "./module.dto";

export interface CompulsoryElectivePairingDTO
  extends Omit<CompulsoryElectivePairing, "createdAt" | "updatedAt" | "moduleHandbook"> {
    Modules: ModuleDTO[]
  }
