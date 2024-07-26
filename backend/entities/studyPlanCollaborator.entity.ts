import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToOne,
  type Relation,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { StudyPlan } from "./studyPlan.entity";

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

  @OneToOne(() => User, (user) => user.studyPlanCollaborator)
  user!: Relation<User>;

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
}
