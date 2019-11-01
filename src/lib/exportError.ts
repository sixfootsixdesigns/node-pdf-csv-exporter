export class ExportError extends Error {
  public status: number;
  public context: any;
  public name: string;

  constructor(message: string, context?: any, status = 500) {
    super(message);
    this.name = 'ExportError';
    this.status = status;
    this.context = context || null;

    // Hack because transpiling to es5
    // https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    Object.setPrototypeOf(this, ExportError.prototype);
  }
}
