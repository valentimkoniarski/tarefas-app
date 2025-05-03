import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ConstraintErrors {
  [type: string]: string;
}

interface ValidationError {
  property: string;
  constraints?: ConstraintErrors;
}

interface HttpExceptionResponse {
  statusCode: number;
  message: ValidationError[] | string;
  error?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | { field: string; message: string }[] =
      'Erro interno do servidor';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseData = exception.getResponse();

      if (
        typeof responseData === 'object' &&
        responseData !== null &&
        'message' in responseData
      ) {
        const typedResponse = responseData as HttpExceptionResponse;

        if (Array.isArray(typedResponse.message)) {
          const originalMessages = typedResponse.message;

          const groupedErrors: Record<string, string[]> = {};

          for (const error of originalMessages) {
            if (error.property && error.constraints) {
              if (!groupedErrors[error.property]) {
                groupedErrors[error.property] = Object.values(
                  error.constraints,
                );
              }
            }
          }

          const customErrors = Object.entries(groupedErrors).map(
            ([field, messages]) => ({
              field,
              message: messages[0],
            }),
          );

          message = customErrors;
        } else {
          message = typedResponse.message;
        }
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
