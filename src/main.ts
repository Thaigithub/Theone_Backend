import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as chalk from 'chalk';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { cleanEnv, port, str } from 'envalid';
import helmet from 'helmet';
import { APP_SECRET, CREDENTIALS, HOST, NODE_ENV, ORIGIN, PORT } from './app.config';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { ValidationPipe } from './pipes/validation.pipe';

async function bootstrap() {
    try {
        validateEnv();
        const app = await NestFactory.create(AppModule, {
            cors: {
                origin: ORIGIN,
                credentials: CREDENTIALS,
            },
        });
        Logger.log(HOST, PORT);

        Logger.log(`🚀 Environment: ${chalk.hex('#33d32e').bold(`${NODE_ENV?.toUpperCase()}`)}`);

        app.use(helmet());
        app.use(cookieParser(APP_SECRET));
        app.use(compression());
        app.use(bodyParser.json({ limit: '50mb' }));
        app.use(
            bodyParser.urlencoded({
                limit: '50mb',
                extended: true,
                parameterLimit: 50000,
            }),
        );
        // app.use(
        //     rateLimit({
        //         windowMs: 1000 * 60 * 60,
        //         max: 1000, // 1000 requests per windowMs
        //         message: '🚫  Too many request created from this IP, please try again after an hour',
        //     }),
        // );

        app.useGlobalInterceptors(new LoggingInterceptor());
        app.useGlobalPipes(new ValidationPipe());
        app.useGlobalFilters(new ErrorMiddleware());

        const options = new DocumentBuilder()
            .setTitle('TheOne API')
            .setDescription('The One API description')
            .setVersion('1.0.0')
            .addBearerAuth()
            .build();

        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('api', app, document);
        SwaggerModule.setup('/', app, document);

        Logger.log('Mapped {/, GET} Swagger api route', 'RouterExplorer');
        Logger.log('Mapped {/api, GET} Swagger api route', 'RouterExplorer');

        await app.listen(PORT || 3000);

        NODE_ENV !== 'production'
            ? Logger.log(
                  `🪭  Server ready at http://${chalk.hex('#e5ff00').bold(`${HOST}`)}:${chalk.hex('#ff6e26').bold(`${PORT}`)}`,
              )
            : Logger.log(`🪽 Server is listening on port ${chalk.hex('#87e8de').bold(`${PORT}`)}`);
    } catch (error) {
        Logger.error(`❌  Error starting server, ${error}`);
        process.exit();
    }
}

function validateEnv() {
    cleanEnv(process.env, {
        DATABASE_URL: str(),
        PORT: port(),
    });
}

bootstrap().catch((e) => {
    Logger.error(`❌  Error starting server, ${e}`);
    throw e;
});
