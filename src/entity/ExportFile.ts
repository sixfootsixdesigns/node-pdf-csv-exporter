import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { S3 } from 'aws-sdk';
import { Exporter } from '../lib/exporter';
import { validateOrReject } from 'class-validator';
import { logger } from '../lib/logger';

export interface ExportFileData {
  csvData?: { [key: string]: any }[];
  csvFields?: string[];
}
export interface ExportFileWithData extends ExportFile {
  data: ExportFileData;
}

export enum ExportFileStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
}

export enum ExportFileTypes {
  PDF = 'pdf',
  CSV = 'csv',
}

@Entity()
export class ExportFile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
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

  @Column({
    type: 'enum',
    enum: ExportFileStatus,
    nullable: true,
    default: ExportFileStatus.PENDING,
  })
  @IsOptional()
  status: ExportFileStatus;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @BeforeUpdate()
  @BeforeInsert()
  public async validate() {
    await validateOrReject(this);
  }

  public getKey(): string {
    return `${this.id}.${this.type}`;
  }

  public getFileName(): string {
    return `${this.name}.${this.type}`;
  }

  public async processExport(data: ExportFileData): Promise<void> {
    const s3Options: S3.ClientConfiguration = { region: process.env.AWS_REGION };
    const exporter = new Exporter(new S3(s3Options), this, data);

    try {
      await exporter.export();
      this.status = ExportFileStatus.SUCCESS;
    } catch (ex) {
      logger.log({
        level: 'error',
        message: ex.message,
      });
      this.status = ExportFileStatus.FAILED;
    }

    await this.save();
  }

  public getDownloadUrl(): string {
    const s3 = new S3();
    return s3.getSignedUrl('getObject', {
      Bucket: process.env.AWS_BUCKET,
      Key: this.getKey(),
      Expires: 300,
    });
  }
}
