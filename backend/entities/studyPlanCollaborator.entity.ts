import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToOne,
  type Relation,
  OneToMany,
} from "typeorm";
import { User } from "./user.entity";
import { Semester } from "./semester.entity";

export enum CollaboratorRole {
  Viewer = "viewer",
  Editor = "editor",
  Owner = "owner"
}

@Entity({ name: "study_plan_collaborator" })
export class StudyPlanCollaborator {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn({ select: false })
  createdAt!: Date;

  @UpdateDateColumn({ select: false })
  updatedAt!: Date;

  @OneToOne(() => User, (user) => user.studyPlan)
  user!: Relation<User>;

  @OneToMany(() => Semester, (semester) => semester.studyPlan, {
    cascade: ["remove"],
  })
  semesters!: Relation<Semester>[];

  @Column()
  hasAccepted!: boolean;

  @Column({
    type: "enum",
    enum: CollaboratorRole,
  })
  role!: CollaboratorRole;
}
