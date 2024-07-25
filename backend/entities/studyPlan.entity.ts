import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from "typeorm";

import { ModuleHandbook } from "./moduleHandbook.entity";
import { Semester } from "./semester.entity";
import { User } from "./user.entity";

export enum StudyPlanScope {
  Public = "public",
  Faculty = "facultyOnly",
  Private = "private",
}

@Entity({ name: "study_plans" })
export class StudyPlan {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn({ select: false })
  createdAt!: Date;

  @UpdateDateColumn({ select: false })
  updatedAt!: Date;

  @OneToOne(() => User, (user) => user.studyPlan)
  user!: Relation<User>;

  @OneToMany(() => Semester, (semester) => semester.studyPlan, {
    cascade: ["remove"],
  })
  semesters!: Relation<Semester>[];

  @Column()
  moduleHandbookId!: string;

  @Column({
    type: "enum",
    enum: StudyPlanScope,
    default: StudyPlanScope.Private
  })
  scope!: StudyPlanScope;

  @ManyToOne(() => ModuleHandbook, (handbook) => handbook.studyPlans)
  @JoinColumn({ name: "moduleHandbookId" })
  moduleHandbook!: Relation<ModuleHandbook>;
}
