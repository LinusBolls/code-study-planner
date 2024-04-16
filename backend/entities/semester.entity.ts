import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  type Relation,
  JoinColumn,
} from "typeorm";
import { SemesterModule } from "./semesterModule.entity";
import { StudyPlan } from "./studyPlan.entity";

@Entity({ name: "semesters" })
export class Semester {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn({ select: false })
  createdAt!: Date;

  @UpdateDateColumn({ select: false })
  updatedAt!: Date;

  @Column({
    nullable: true,
    comment:
      "the id of the corresponding resource of the CODE learning platform. for semesters that don't yet exist on the learning platform because they are too far in the future, this is null.",
  })
  lpId!: string;

  @OneToMany(
    () => SemesterModule,
    (semesterModule) => semesterModule.semester,
    {
      cascade: ["remove"],
    }
  )
  semesterModules!: Relation<SemesterModule>[];

  @Column({ comment: "the starting date of the semester." })
  startDate!: Date;

  @Column()
  studyPlanId!: string;

  @ManyToOne(() => StudyPlan, (studyPlan) => studyPlan.semesters)
  @JoinColumn({ name: "studyPlanId" })
  studyPlan!: Relation<StudyPlan>;
}
