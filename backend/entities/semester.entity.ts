import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  type Relation,
} from "typeorm";
import { User } from "./user.entity";
import { SemesterModule } from "./semesterModule.entity";

@Entity()
export class Semester {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn({ select: false })
  createdAt!: Date;

  @UpdateDateColumn({ select: false })
  updatedAt!: Date;

  @Column({ nullable: true })
  lpId!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User, (user) => user.semesters)
  user!: Relation<User>;

  @OneToMany(() => SemesterModule, (semesterModule) => semesterModule.semester)
  semesterModules!: Relation<SemesterModule>[];

  @Column()
  startDate!: Date;
}
