import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  type Relation,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { Semester } from "./semester.entity";
import { Module } from "./module.entity";

export enum AssessmentType {
  Early = "earlyAssessments",
  Standard = "standartAssessments",
  Alternative = "alternativeAssessments",
  Reassessment = "reassessments",
}

// @Unique("my_unique_constraint", ["semesterId", "assessmentType", "index", "userId"])
@Entity({ name: "semester_modules" })
export class SemesterModule {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn({ select: false })
  createdAt!: Date;

  @UpdateDateColumn({ select: false })
  updatedAt!: Date;

  @Column({
    comment: "index of the module in the list of modules in the semester",
  })
  index!: number;

  @Column({
    type: "enum",
    enum: AssessmentType,
  })
  assessmentType!: string;

  @Column()
  semesterId!: string;

  @Column()
  moduleId!: string;

  @ManyToOne(() => Semester, (semester) => semester.semesterModules)
  @JoinColumn({ name: "semesterId" })
  semester!: Relation<Semester>;

  @OneToOne(() => Module, (module) => module.id)
  @JoinColumn({ name: "moduleId" })
  module!: Relation<Module>;
}
