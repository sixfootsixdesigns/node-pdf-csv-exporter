import { S3 } from 'aws-sdk';
import * as Handlebars from 'handlebars';
import { Parser } from 'json2csv';
import * as pretty from 'prettysize';
import * as puppeteer from 'puppeteer';
import { FileModel } from '../../../models/file/file-model';
import { ExportFileTypes } from './export-types';
import { User } from '../../../lib/user';
import { getPDF } from './pdf-templates';

export class Exporter {
  public fileData: FileModel;
  public userData: User;
  public exportData: any;
  public s3: S3;

  constructor(s3: any, file: FileModel, user: User, data: any) {
    this.s3 = s3;
    this.registerHandlebarHelpers();
    this.fileData = file;
    this.userData = user;
    this.exportData = data;
  }

  public async export(): Promise<any> {
    if (!this.fileData) {
      throw new Error('File data not found');
    }

    if (this.fileData.type !== ExportFileTypes.PDF && this.fileData.type !== ExportFileTypes.CSV) {
      throw new Error(`File type ${this.fileData.type} is not supported`);
    }

    if (!this.userData) {
      throw new Error('User data not found');
    }

    if (!this.exportData) {
      throw new Error('Property data not found');
    }

    // set path based on name and type
    this.fileData.path = `${this.fileData.getFileName()}.${this.fileData.type}`;

    switch (this.fileData.type) {
      case ExportFileTypes.PDF:
        const puppeteerArgs: any = {};
        if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'production') {
          puppeteerArgs.args = ['--no-sandbox', '--disable-setuid-sandbox'];
        }

        const browser = await puppeteer.launch(puppeteerArgs);

        const page = await browser.newPage();

        const html = this.getPdfHtml();

        await page.goto(`data:text/html,${html}`, {
          waitUntil: 'networkidle0',
        });

        const options: puppeteer.PDFOptions = {
          format: 'Letter',
        };

        const pdf: Buffer = await page.pdf(options);

        await browser.close();

        this.fileData.size = pretty(pdf.byteLength);

        await this.saveToBucket(pdf);

        return true;

      case ExportFileTypes.CSV:
        const csv = this.getCSV();

        this.fileData.size = pretty(csv.byteLength);

        await this.saveToBucket(csv);

        return true;

      default:
        throw new Error('export type not set, nothing to export');
    }
  }

  public async saveToBucket(file: Buffer): Promise<S3.PutObjectOutput> {
    const params = {
      Bucket: process.env.AWS_EXPORT_PROCESSED_BUCKET,
      Key: this.fileData.path,
      Body: file,
    };
    return this.s3.putObject(params).promise();
  }

  public getCSV(): Buffer {
    let fields;
    let opts = null;
    if (this.exportData.fields) {
      fields = this.exportData.fields;
    } else {
      fields = Object.keys(this.exportData.properties[0]).sort();
    }
    if (fields) {
      opts = { fields };
    }
    const parser = new Parser(opts);
    const csv = parser.parse(this.exportData.properties);
    return Buffer.from(csv);
  }

  public getPdfHtml(): string {
    const template = Handlebars.compile(getPDF());
    return template({
      exportData: this.exportData,
      userData: this.userData,
    });
  }

  private registerHandlebarHelpers(): void {}
}
