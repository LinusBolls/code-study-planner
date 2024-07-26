import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  type Relation,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { StudyPlan } from "./studyPlan.entity";
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

  @Column()
  studyPlanCollaboratorId!: string;

  @OneToOne(
    () => StudyPlanCollaborator,
    (studyPlanCollaborator) => studyPlanCollaborator.user,
    {
      cascade: ["remove"],
    },
  )
  @JoinColumn({ name: "studyPlanCollaboratorId" })
  studyPlanCollaborator!: Relation<StudyPlanCollaborator>;
}
