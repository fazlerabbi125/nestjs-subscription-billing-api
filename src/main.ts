import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import * as cookieParser from 'cookie-parser';
import { CustomExceptionFilter } from './common/custom-exception.filter';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    /**Alternate is to use with the above create method. Unlike this way, you get type completion
     * in that way
     * */
    app.enableCors({
        origin: true,
        // credentials: true,
    });
    // Enable validation globally
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            validationError: {
                target: false,
            },
            exceptionFactory(errors) {
                const result: Record<string, string> = {};
                errors.forEach((error) => {
                    result[error.property] = Object.values(error.constraints || {})?.[0];
                });
                return new UnprocessableEntityException({
                    message: 'Validation error found',
                    errors: result,
                });
            },
        }),
    );

    // app.use(cookieParser());
    app.useGlobalFilters(new CustomExceptionFilter());

    // Swagger configuration
    const config = new DocumentBuilder()
        .setTitle('Subscription Billing Nest API')
        .setDescription('Subscription Billing API documentation')
        .setVersion('1.0')
        .addTag('Auth') //Maps to API routes under this tag. By default, it uses the first part of the controller name
        .addTag('Users')
        .addTag('Plans')
        .addTag('Subscriptions')
        .addTag('Payments')
        .addBearerAuth() // Other Auth types are also available
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
