import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  type Relation,
  Unique,
} from "typeorm";
import { Semester } from "./semester.entity";
import { Module } from "./module.entity";

// @Unique("my_unique_constraint", ["semesterId", "assessmentType", "index", "userId"])
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

  @Column({ nullable: true })
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

  @ManyToOne(() => Module, (module) => module.id, { nullable: true })
  module!: Relation<Module>;
}
