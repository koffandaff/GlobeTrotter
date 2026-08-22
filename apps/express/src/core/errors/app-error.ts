export type ErrorCode =
  | "VALIDATION_ERROR"
  | "BAD_REQUEST"
  | "AUTHENTICATION_ERROR"
  | "AUTHORIZATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "DATABASE_ERROR"
  | "EXTERNAL_SERVICE_ERROR"
  | "INTERNAL_SERVER_ERROR"
  | "PAYLOAD_TOO_LARGE"
  | "RATE_LIMIT_EXCEEDED";

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: ErrorCode;
  readonly details?: unknown;
  readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, code: ErrorCode = "INTERNAL_SERVER_ERROR", details?: unknown) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation Error", details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", details?: unknown) {
    super(message, 400, "BAD_REQUEST", details);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication Required") {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

export class AuthorizationError extends AppError {
  constructor(message = "Permission Denied") {
    super(message, 403, "AUTHORIZATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource Not Found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource Conflict") {
    super(message, 409, "CONFLICT");
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Database Error") {
    super(message, 500, "DATABASE_ERROR");
  }
}

export class ExternalServiceError extends AppError {
  constructor(message = "External Service Error") {
    super(message, 502, "EXTERNAL_SERVICE_ERROR");
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal Server Error") {
    super(message, 500, "INTERNAL_SERVER_ERROR");
  }
}

export class PayloadTooLargeError extends AppError {
  constructor(message = "Request Payload Too Large") {
    super(message, 413, "PAYLOAD_TOO_LARGE");
  }
}
