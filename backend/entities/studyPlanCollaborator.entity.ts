import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
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

  @ManyToOne(() => StudyPlan, (studyPlan) => studyPlan.studyPlanCollaborator)
  @JoinColumn({ name: "studyPlanId" })
  studyPlan!: Relation<StudyPlan>;

  @Column()
  userId!: string;

  @ManyToOne(() => User, (user) => user.studyPlanCollaborator)
  @JoinColumn({ name: "userId" })
  user!: Relation<User>;
}
