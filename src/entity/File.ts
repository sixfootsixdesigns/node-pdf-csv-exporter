import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';

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
  @IsNotEmpty()
  uuid: string;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column({
    type: 'enum',
    enum: ExportFileTypes,
  })
  @IsEnum(ExportFileTypes)
  type: ExportFileTypes;

  @Column({ nullable: true })
  path: string;

  @Column({
    type: 'enum',
    enum: ExportStatus,
    nullable: true,
    default: ExportStatus.PENDING,
  })
  @IsOptional()
  status: ExportStatus;

  @Column({ nullable: true })
  size: string;

  @CreateDateColumn()
  public created: Date;

  @UpdateDateColumn()
  public updated: Date;

  public getKey() {
    return `${this.id}.${this.type}`;
  }

  public getFileName() {
    return `${this.name}.${this.type}`;
  }
}
