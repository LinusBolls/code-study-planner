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
  type Relation,
  ManyToOne,
  JoinColumn,
  Column,
} from "typeorm";
import { Semester } from "./semester.entity";
import { ModuleHandbook } from "./moduleHandbook.entity";
import { StudyPlanCollaborator } from "./studyPlanCollaborator.entity";

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
  studyPlanCollaborator!: Relation<StudyPlanCollaborator>[];

  @Column({
    type: "enum",
    enum: StudyPlanScope,
    default: StudyPlanScope.Private,
  })
  scope!: StudyPlanScope;

  @Column()
  moduleHandbookId!: string;

  @ManyToOne(() => ModuleHandbook, (handbook) => handbook.studyPlans)
  @JoinColumn({ name: "moduleHandbookId" })
  moduleHandbook!: Relation<ModuleHandbook>;
}
