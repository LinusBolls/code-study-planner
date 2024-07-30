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

import { StudyPlan } from "./studyPlan.entity";
import { User } from "./user.entity";

export enum CollaboratorRole {
  Viewer = "viewer",
  Editor = "editor",
  Owner = "owner",
}

@Entity({ name: "study_plan_collaborators" })
@Unique(["studyPlanId", "userId"])
export class StudyPlanCollaborator {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn({ select: false })
  createdAt!: Date;

  @UpdateDateColumn({ select: false })
  updatedAt!: Date;

  @Column()
  hasAccepted!: boolean;

  @Column({
    type: "enum",
    enum: CollaboratorRole,
  })
  role!: CollaboratorRole;

  @Column()
  studyPlanId!: string;

  @ManyToOne(() => StudyPlan, (studyPlan) => studyPlan.studyPlanCollaborators)
  @JoinColumn({ name: "studyPlanId" })
  studyPlan!: Relation<StudyPlan>;

  @Column()
  userId!: string;

  @ManyToOne(() => User, (user) => user.studyPlanCollaborator)
  @JoinColumn({ name: "userId" })
  user!: Relation<User>;
}
