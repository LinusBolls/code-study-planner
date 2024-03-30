import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  type Relation,
} from "typeorm";
import { Semester } from "./semester.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn({ select: false })
  createdAt!: Date;

  @UpdateDateColumn({ select: false })
  updatedAt!: Date;

  @Column()
  lpId!: string;

  @OneToMany(() => Semester, (semester) => semester.user)
  semesters!: Relation<Semester>[];
}
