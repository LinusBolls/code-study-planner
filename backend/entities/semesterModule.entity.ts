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
  Unique,
} from "typeorm";
import { Semester } from "./semester.entity";
import { Module } from "./module.entity";

export enum AssessmentType {
  Early = "earlyAssessments",
  Standard = "standartAssessments",
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

  @OneToOne(() => Module, (module) => module.id)
  @JoinColumn({ name: "moduleId" })
  module!: Relation<Module>;
}
