import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  type Relation,
  JoinTable,
} from "typeorm";
import { CompulsoryElectivePairing } from "./compulsoryElectivePairing.entity";

@Entity({ name: "modules" })
export class Module {
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
    comment:
      "an integer between 0 and 4 indicating how demanding the module requirements are for students. this is based on feedback by CODE students and professors.",
  })
  proficiency!: number;

  @Column({
    comment:
      "if true, the module information might be outdated and should be manually checked / updated by a study plan admin.",
  })
  possiblyOutdated!: boolean;

  @Column({ unique: true })
  moduleIdentifier!: string;

  @ManyToMany(() => CompulsoryElectivePairing, (pairing) => pairing.modules)
  @JoinTable()
  compulsoryElectivePairings!: Relation<CompulsoryElectivePairing>[];
}
