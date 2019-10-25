import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ExportStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
}

export enum ExportFileTypes {
  PDF = 'pdf',
  CSV = 'csv',
}

@Entity()
export class File extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: ExportFileTypes,
  })
  type: ExportFileTypes;

  @Column()
  path: string;

  @Column({
    type: 'enum',
    enum: ExportStatus,
  })
  status: ExportStatus;

  @Column()
  size: string;

  @CreateDateColumn()
  public created: Date;

  @UpdateDateColumn()
  public updated: Date;
}
