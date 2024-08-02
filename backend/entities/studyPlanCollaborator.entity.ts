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

import { CollaboratorRole } from "./enums";
import { StudyPlan } from "./studyPlan.entity";
import { User } from "./user.entity";

@Entity({ name: "study_plan_collaborators" })
@Unique(["studyPlanId", "userId"])
export class StudyPlanCollaborator {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn({ select: false })
  createdAt!: Date;

  @UpdateDateColumn({ select: false })
  updatedAt!: Date;

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

  @ManyToOne(() => User, (user) => user.studyPlanCollaborators)
  @JoinColumn({ name: "userId" })
  user!: Relation<User>;

  private get isViewer() {
    return this.role === CollaboratorRole.Viewer;
  }
  private get isEditor() {
    return this.role === CollaboratorRole.Editor;
  }
  private get isAdmin() {
    return this.role === CollaboratorRole.Admin;
  }
  private get isOwner() {
    return this.role === CollaboratorRole.Owner;
  }

  public get canViewStudyPlan() {
    return true;
  }
  public get canModifyStudyPlan() {
    return this.isEditor || this.isAdmin || this.isOwner;
  }

  public get canViewCollaborators() {
    return true;
  }
  public get canManageCollaborators() {
    return this.isAdmin || this.isOwner;
  }

  public get canChangeStudyPlanScope() {
    return this.isOwner;
  }
}
