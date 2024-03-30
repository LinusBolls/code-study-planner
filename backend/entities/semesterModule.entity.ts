import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  type Relation,
} from "typeorm";
import { Semester } from "./semester.entity";
import { Module } from "./module.entity";

@Entity()
export class SemesterModule {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn({ select: false })
  createdAt!: Date;

  @UpdateDateColumn({ select: false })
  updatedAt!: Date;

  @Column()
  semesterId!: string;

  @Column()
  moduleId!: string;

  @Column({
    comment: "index of the module in the list of modules in the semester",
  })
  index!: number;

  @Column({
    comment: "early, standard, alternative, reassessment",
  })
  assessmentType!: string;

  @ManyToOne(() => Semester, (semester) => semester.semesterModules)
  semester!: Relation<Semester>;

  @ManyToOne(() => Module, (module) => module.id)
  module!: Relation<Module>;
}
