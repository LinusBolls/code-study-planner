import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  type Relation,
  OneToMany,
} from "typeorm";
import { ModuleHandbook } from "./moduleHandbook.entity";

export enum StudyProgramAbbreviation {
  SE = "SE",
  ID = "ID",
  PM = "PM",
}

@Entity({ name: "study_programs" })
export class StudyProgram {
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

  @Column({
    type: "enum",
    enum: StudyProgramAbbreviation,
    unique: true,
  })
  abbreviation!: StudyProgramAbbreviation;

  @OneToMany(() => ModuleHandbook, (handbook) => handbook.studyProgram, {
    cascade: ["remove"],
  })
  moduleHandbooks!: Relation<ModuleHandbook>[];
}
