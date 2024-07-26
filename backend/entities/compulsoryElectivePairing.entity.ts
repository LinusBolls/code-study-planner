import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from "typeorm";

import { Module } from "./module.entity";
import { ModuleHandbook } from "./moduleHandbook.entity";

@Entity({ name: "compulsory_elective_pairings" })
export class CompulsoryElectivePairing {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn({ select: false })
  createdAt!: Date;

  @UpdateDateColumn({ select: false })
  updatedAt!: Date;

  @Column()
  moduleHandbookId!: string;

  @ManyToOne(
    () => ModuleHandbook,
    (handbook) => handbook.compulsoryElectivePairings,
  )
  @JoinColumn({ name: "moduleHandbookId" })
  moduleHandbook!: Relation<ModuleHandbook>;

  @ManyToMany(() => Module, (module) => module.compulsoryElectivePairings)
  modules!: Relation<Module>[];
}
