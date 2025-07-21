import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { CustomExceptionFilter } from './common/custom-exception.filter';
import { HttpStatus, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    /**Alternate is to use with the above create method. Unlike this way, you get type completion
     * in that way
     * */
    app.enableCors({
        origin: true,
        credentials: true,
    });
    // Enable validation globally
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    );

    app.use(cookieParser());
    // app.useGlobalFilters(new CustomExceptionFilter());

    // Swagger configuration
    const config = new DocumentBuilder()
        .setTitle('Subscription Billing Nest API')
        .setDescription('Subscription Billing API documentation')
        .setVersion('1.0')
        .addTag('Auth')
        .addTag('Users')
        .addTag('Plans')
        .addTag('Subscriptions')
        .addTag('Payments')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
