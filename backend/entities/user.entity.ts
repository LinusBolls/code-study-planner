import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
  Unique,
  UpdateDateColumn,
} from "typeorm";

import { Invite } from "./invite.entity";
import { StudyPlan } from "./studyPlan.entity";
import { StudyPlanCollaborator } from "./studyPlanCollaborator.entity";

@Entity({ name: "users" })
@Unique(["lpId"])
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn({ select: false })
  createdAt!: Date;

  @UpdateDateColumn({ select: false })
  updatedAt!: Date;

  @Column({
    comment:
      "the id of the corresponding resource of the CODE learning platform.",

    unique: true,
  })
  lpId!: string;

  @OneToMany(
    () => StudyPlanCollaborator,
    (studyPlanCollaborator) => studyPlanCollaborator.user,
    {
      cascade: ["remove"],
    },
  )
  studyPlanCollaborators!: Relation<StudyPlanCollaborator>[];

  @OneToMany(
    () => StudyPlan,
    (studyPlan) => studyPlan.subject,

    {
      cascade: ["remove"],
    },
  )
  studyPlans!: Relation<StudyPlan>[];

  @OneToMany(() => Invite, (invite) => invite.invitedBy, {
    cascade: ["remove"],
  })
  invites!: Relation<Invite>[];
}
