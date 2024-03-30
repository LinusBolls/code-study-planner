import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Module {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn({ select: false })
  createdAt!: Date;

  @UpdateDateColumn({ select: false })
  updatedAt!: Date;

  @Column()
  lpId!: string;

  @Column()
  proficiency!: number;
}
