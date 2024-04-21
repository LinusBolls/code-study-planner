import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  type Relation,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { CompulsoryElectivePairing } from "./compulsoryElectivePairing.entity";
import { StudyProgram } from "./studyProgram.entity";
import { StudyPlan } from "./studyPlan.entity";

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
