import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from "typeorm";

import { CompulsoryElectivePairing } from "./compulsoryElectivePairing.entity";
import { StudyPlan } from "./studyPlan.entity";
import { StudyProgram } from "./studyProgram.entity";

@Entity({ name: "module_handbooks" })
export class ModuleHandbook {
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

  compulsoryElectivePairings!: Relation<CompulsoryElectivePairing>[];

  @OneToMany(() => StudyPlan, (studyPlan) => studyPlan.moduleHandbook)
  studyPlans!: Relation<StudyPlan>[];

  @Column()
  studyProgramId!: string;

  @ManyToOne(() => StudyProgram, (studyProgram) => studyProgram.moduleHandbooks)
  @JoinColumn({ name: "studyProgramId" })
  studyProgram!: Relation<StudyProgram>;

  @Column()
  name!: string;
}
