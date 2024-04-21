import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  type Relation,
  JoinColumn,
  ManyToMany,
} from "typeorm";
import { ModuleHandbook } from "./moduleHandbook.entity";
import { Module } from "./module.entity";

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
    (handbook) => handbook.compulsoryElectivePairings
  )
  @JoinColumn({ name: "moduleHandbookId" })
  moduleHandbook!: Relation<ModuleHandbook>;

  @ManyToMany(() => Module, (module) => module.compulsoryElectivePairings)
  modules!: Relation<Module>[];
}
