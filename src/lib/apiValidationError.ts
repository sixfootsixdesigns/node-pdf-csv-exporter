class ApiValidationError extends Error {
  public status: number;
  public context: any;
  public name: string;

  constructor(message: string, context?: any, status = 400) {
    super(message);
    this.name = 'ApiValidationError';
    this.status = status;
    this.context = context || null;

    // Hack because transpiling to es5
    // https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    Object.setPrototypeOf(this, ApiValidationError.prototype);
  }
}

export { ApiValidationError };
