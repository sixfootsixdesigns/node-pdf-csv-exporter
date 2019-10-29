import { buildResponseBody, ResponseBody } from './response';

interface ErrorMessage {
  errors: string;
}

interface ErrorResponse extends ResponseBody {
  message: string;
  data: ErrorMessage;
}

class ApiValidationError extends Error {
  public response: ErrorResponse;
  public status: number;
  public context: any;
  public name: string;

  constructor(message: string, context?: any, status = 400) {
    super(message);
    this.name = 'ApiValidationError';
    this.status = status;
    this.context = context || null;
    this.response = buildResponseBody({ errors: message }, 'Bad Request');

    // Hack because transpiling to es5
    // https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    Object.setPrototypeOf(this, ApiValidationError.prototype);
  }
}

class AWSError extends Error {
  public response: ErrorResponse;
  public status: number;
  public context: any;
  public name: string;

  constructor(message: string, context?: any, status = 500) {
    super(message);
    this.name = 'AWSError';
    this.status = status;
    this.context = context || null;
    this.response = buildResponseBody({ errors: message }, 'AWS Error');

    // Hack because transpiling to es5
    // https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    Object.setPrototypeOf(this, AWSError.prototype);
  }
}

class NotFoundError extends Error {
  public response: ErrorResponse;
  public status: number;
  public context: any;
  public name: string;

  constructor(message: string, context?: any, status = 404) {
    super(message);
    this.name = 'NotFoundError';
    this.status = status;
    this.context = context || null;
    this.response = buildResponseBody({ errors: message }, 'Not Found');

    // Hack because transpiling to es5
    // https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export { AWSError, ErrorResponse, ErrorMessage, NotFoundError, ApiValidationError };
