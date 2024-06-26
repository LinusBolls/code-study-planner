import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  type Relation,
  OneToOne,
  ManyToOne,
  JoinColumn,
  Column,
} from "typeorm";
import { User } from "./user.entity";
import { Semester } from "./semester.entity";
import { ModuleHandbook } from "./moduleHandbook.entity";

@Entity({ name: "study_plans" })
export class StudyPlan {
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
  moduleHandbookId!: string;

  @ManyToOne(() => ModuleHandbook, (handbook) => handbook.studyPlans)
  @JoinColumn({ name: "moduleHandbookId" })
  moduleHandbook!: Relation<ModuleHandbook>;
}
