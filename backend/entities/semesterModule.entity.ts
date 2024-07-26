import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  Unique,
  UpdateDateColumn,
} from "typeorm";

import { Module } from "./module.entity";
import { Semester } from "./semester.entity";

export enum AssessmentType {
  Early = "earlyAssessments",
  Standard = "standardAssessments",
  Alternative = "alternativeAssessments",
  Reassessment = "reassessments",
}

@Unique("studyPlan_and_semester_and_assessmentType_and_index", [
  "semesterId",
  "assessmentType",
  "index",
])
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
  assessmentType!: AssessmentType;

  @Column()
  semesterId!: string;

  @Column()
  moduleId!: string;

  @ManyToOne(() => Semester, (semester) => semester.semesterModules)
  @JoinColumn({ name: "semesterId" })
  semester!: Relation<Semester>;

  @ManyToOne(() => Module, (module) => module.id)
  @JoinColumn({ name: "moduleId" })
  module!: Relation<Module>;
}
