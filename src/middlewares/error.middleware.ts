import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { NODE_ENV } from 'app.config';
import { Response } from 'express';

@Catch(Error)
export class ErrorMiddleware implements ExceptionFilter {
    private readonly logger = new Logger(ErrorMiddleware.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status: number = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const message: string = exception.message || 'Internal Server Error';
        const name: string = exception.name || 'HttpException';

        this.logger.error(exception.message, exception.stack);
        response.status(status).json({
            name,
            message: message,
            statusCode: status,
            path: request.url,
            timestamp: new Date().toISOString(),
            error: (exception as any).error,
            stack: NODE_ENV === 'production' ? '🧌' : exception.stack,
        });
    }
}
