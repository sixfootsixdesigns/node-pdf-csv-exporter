import {
  Entity,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { S3 } from 'aws-sdk';
import { Exporter } from '../lib/exporter';

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

  public getKey(): string {
    return `${this.id}.${this.type}`;
  }

  public getFileName(): string {
    return `${this.name}.${this.type}`;
  }

  public async processExport(data: ExportFileData): Promise<void> {
    const s3Options: S3.ClientConfiguration = { region: process.env.AWS_REGION };

    if (process.env.AWS_ENDPOINT) {
      s3Options.endpoint = `http://${process.env.AWS_ENDPOINT}:4572`;
      s3Options.s3ForcePathStyle = true;
    }

    const exporter = new Exporter(new S3(s3Options), this, data);

    try {
      await exporter.export();
      this.status = ExportFileStatus.SUCCESS;
    } catch (ex) {
      this.status = ExportFileStatus.FAILED;
    }

    await this.save();
  }

  public getDownloadUrl(): string {
    const s3 = new S3();
    return s3.getSignedUrl('getObject', {
      Bucket: process.env.AWS_EXPORT_BUCKET,
      Key: this.getKey(),
      Expires: 300,
    });
  }
}
