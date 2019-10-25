import { buildResponseBody, ResponseBody } from './response';

interface ErrorMessage {
  errors: string;
}

interface ErrorResponse extends ResponseBody {
  message: string;
  data: ErrorMessage;
}

class DatabaseError extends Error {
  public response: ErrorResponse;
  public status: number;
  public context: any;

  constructor(message: string, context?: any, status = 400) {
    super(message);
    this.status = status;
    this.context = context || null;
    this.response = buildResponseBody({ errors: message }, 'Bad Request');

    // Hack because transpiling to es5
    // https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

class ValidationError extends Error {
  public response: ErrorResponse;
  public status: number;
  public context: any;

  constructor(message: string, context?: any, status = 400) {
    super(message);
    this.status = status;
    this.context = context || null;
    this.response = buildResponseBody({ errors: message }, 'Bad Request');

    // Hack because transpiling to es5
    // https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

class AWSError extends Error {
  public response: ErrorResponse;
  public status: number;
  public context: any;

  constructor(message: string, context?: any, status = 500) {
    super(message);
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

  constructor(message: string, context?: any, status = 404) {
    super(message);
    this.status = status;
    this.context = context || null;
    this.response = buildResponseBody({ errors: message }, 'Not Found');

    // Hack because transpiling to es5
    // https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export { AWSError, ErrorResponse, ErrorMessage, DatabaseError, NotFoundError, ValidationError };
