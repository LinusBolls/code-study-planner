import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from "typeorm";

import { ModuleHandbook } from "./moduleHandbook.entity";
import { Semester } from "./semester.entity";
import { StudyPlanCollaborator } from "./studyPlanCollaborator.entity";
import { User } from "./user.entity";

export enum StudyPlanScope {
  Public = "public",
  Faculty = "facultyOnly",
  Private = "private",
}

/**
 * @param subjectId refers to the user which the study plan is about
 */
@Entity({ name: "study_plans" })
export class StudyPlan {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn({ select: false })
  createdAt!: Date;

  @UpdateDateColumn({ select: false })
  updatedAt!: Date;

  @Column({
    type: "enum",
    enum: StudyPlanScope,
    default: StudyPlanScope.Private,
  })
  scope!: StudyPlanScope;

  @OneToMany(() => Semester, (semester) => semester.studyPlan, {
    cascade: ["remove"],
  })
  semesters!: Relation<Semester>[];

  @OneToMany(
    () => StudyPlanCollaborator,
    (studyPlanCollaborator) => studyPlanCollaborator.studyPlan,
    {
      cascade: ["remove"],
    },
  )
  studyPlanCollaborators!: Relation<StudyPlanCollaborator>[];

  @Column()
  moduleHandbookId!: string;

  @ManyToOne(() => ModuleHandbook, (handbook) => handbook.studyPlans)
  @JoinColumn({ name: "moduleHandbookId" })
  moduleHandbook!: Relation<ModuleHandbook>;

  @Column()
  subjectId!: string;

  @ManyToOne(() => User, (user) => user.studyPlans)
  @JoinColumn({ name: "subjectId" })
  subject!: Relation<User>;
}
