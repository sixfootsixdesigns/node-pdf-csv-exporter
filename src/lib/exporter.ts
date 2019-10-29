import { S3 } from 'aws-sdk';
import * as Handlebars from 'handlebars';
import { Parser } from 'json2csv';
import * as puppeteer from 'puppeteer';
import { ExportFile, ExportFileTypes, ExportFileData } from '../entity/ExportFile';
import { getPdf } from '../pdf-layouts/get-pdf';
import { ApiValidationError } from './error';

export class Exporter {
  public file: ExportFile;
  public exportData: ExportFileData;
  public s3: S3;

  constructor(s3: S3, file: ExportFile, data: ExportFileData) {
    this.s3 = s3;
    this.registerHandlebarHelpers();
    this.file = file;
    this.exportData = data;
  }

  public async export(): Promise<boolean> {
    if (!this.exportData) {
      throw new ApiValidationError('data not found');
    }

    switch (this.file.type) {
      case ExportFileTypes.PDF:
        const puppeteerArgs: puppeteer.LaunchOptions = {};
        if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'production') {
          puppeteerArgs.args = ['--no-sandbox', '--disable-setuid-sandbox'];
        }

        const browser = await puppeteer.launch(puppeteerArgs);

        const page = await browser.newPage();

        await page.goto(`data:text/html,${this.getPdfHtml()}`, {
          waitUntil: 'networkidle0',
        });

        const options: puppeteer.PDFOptions = {
          format: 'Letter',
        };

        const pdf: Buffer = await page.pdf(options);

        await browser.close();
        await this.saveToBucket(pdf);

        return true;

      case ExportFileTypes.CSV:
        await this.saveToBucket(this.getCSV());
        return true;

      default:
        throw new ApiValidationError('export type not set, nothing to export');
    }
  }

  public async saveToBucket(file: Buffer): Promise<S3.PutObjectOutput> {
    const params: S3.PutObjectRequest = {
      Bucket: process.env.AWS_BUCKET || '',
      Key: this.file.getKey(),
      Body: file,
    };
    return this.s3.putObject(params).promise();
  }

  public getCSV(): Buffer {
    if (!this.exportData.csvData || !this.exportData.csvData.length) {
      throw new ApiValidationError('no csvData sent');
    }

    const fields = this.exportData.csvFields || Object.keys(this.exportData.csvData[0]);
    const parser = new Parser({ fields });

    return Buffer.from(parser.parse(this.exportData.csvData));
  }

  public getPdfHtml(): string {
    const template = Handlebars.compile(getPdf());
    return template({
      exportData: this.exportData,
    });
  }

  private registerHandlebarHelpers(): void {}
}
