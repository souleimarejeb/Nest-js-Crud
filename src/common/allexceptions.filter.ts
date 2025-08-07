import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { error } from 'console';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private logger: Logger) { }

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();


        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'internal server error ';

        if (exception instanceof HttpException) {
            console.log("here is the error")
            status = exception.getStatus();
            message = 'something went bad ';
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        this.logger.error(
            `${request.method} ${request.url} ${status} error:{ ${message} } `
        );
        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
                error: message
            });
    }
}