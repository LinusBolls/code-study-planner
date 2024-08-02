import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from "typeorm";

import { CollaboratorRole } from "./enums";
import { StudyPlan } from "./studyPlan.entity";
import "./studyPlanCollaborator.entity";
import { User } from "./user.entity";

export enum InviteStatus {
  Pending = "pending",
  Declined = "declined",
  Accepted = "accepted",
}

@Entity({ name: "invites" })
export class Invite {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn({ select: false })
  createdAt!: Date;

  @UpdateDateColumn({ select: false })
  updatedAt!: Date;

  @Column({
    comment:
      "the id of the corresponding resource of the CODE learning platform.",
  })
  inviteeLpId!: string;

  @Column({
    type: "enum",
    enum: CollaboratorRole,
  })
  role!: CollaboratorRole;

  @Column({ type: "enum", enum: InviteStatus, default: InviteStatus.Pending })
  status!: InviteStatus;

  @Column()
  studyPlanId!: string;

  @ManyToOne(() => StudyPlan, (studyPlan) => studyPlan.studyPlanCollaborators)
  @JoinColumn({ name: "studyPlanId" })
  studyPlan!: Relation<StudyPlan>;

  @Column()
  invitedById!: string;

  @ManyToOne(() => User, (user) => user.studyPlanCollaborators)
  @JoinColumn({ name: "userId" })
  invitedBy!: Relation<User>;
}
