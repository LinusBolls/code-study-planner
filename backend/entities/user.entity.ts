import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from "typeorm";

import { StudyPlan } from "./studyPlan.entity";

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
  studyPlanId!: string;

  @OneToOne(() => StudyPlan, (studyPlan) => studyPlan.user, {
    cascade: ["remove"],
  })
  @JoinColumn({ name: "studyPlanId" })
  studyPlan!: Relation<StudyPlan>;
}
