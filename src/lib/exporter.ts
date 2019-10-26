import { S3 } from 'aws-sdk';
import * as Handlebars from 'handlebars';
import { Parser } from 'json2csv';
import * as pretty from 'prettysize';
import * as puppeteer from 'puppeteer';
import { File, ExportFileTypes } from '../entity/File';
import { getPdf } from '../pdf-layouts/getPdf';
import { ValidationError } from './error';

interface ExportResult {
  size: string;
  saved: boolean;
}

export class Exporter {
  public file: File;
  public exportData: any;
  public s3: S3;

  constructor(s3: S3, file: File, data: any) {
    this.s3 = s3;
    this.registerHandlebarHelpers();
    this.file = file;
    this.exportData = data;
  }

  public async export(): Promise<ExportResult> {
    if (!this.exportData) {
      throw new ValidationError('data not found');
    }

    switch (this.file.type) {
      case ExportFileTypes.PDF:
        const puppeteerArgs: puppeteer.LaunchOptions = {};
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
        await this.saveToBucket(pdf);

        return {
          size: pretty(pdf.byteLength),
          saved: true,
        };

      case ExportFileTypes.CSV:
        const csv = this.getCSV();

        await this.saveToBucket(csv);

        return {
          size: pretty(csv.byteLength),
          saved: true,
        };

      default:
        throw new ValidationError('export type not set, nothing to export');
    }
  }

  public async saveToBucket(file: Buffer): Promise<S3.PutObjectOutput> {
    const params = {
      Bucket: process.env.AWS_EXPORT_BUCKET,
      Key: this.file.getKey(),
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
    const template = Handlebars.compile(getPdf());
    return template({
      exportData: this.exportData,
    });
  }

  private registerHandlebarHelpers(): void {}
}
