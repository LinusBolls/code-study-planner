import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from "typeorm";

import { StudyPlanCollaborator } from "./studyPlanCollaborator.entity";

@Entity({ name: "users" })
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
  studyPlanCollaborator!: Relation<StudyPlanCollaborator>[];
}
