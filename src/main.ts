import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { CustomExceptionFilter } from './common/custom-exception.filter';

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
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.use(cookieParser());
    app.useGlobalFilters(new CustomExceptionFilter());

    // Swagger configuration
    const config = new DocumentBuilder()
        .setTitle('Subscription Billing Nest API')
        .setDescription('Subscription Billing API documentation')
        .setVersion('1.0')
        .addTag('Authentication')
        .addTag('Users')
        .addTag('Plans')
        .addTag('Subscriptions')
        .addTag('Payments')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
