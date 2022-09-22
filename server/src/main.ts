import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const useGlobalValidationPipe = (app: INestApplication): void => {
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            whitelist: true,
            forbidUnknownValues: true,
        }),
    );
};

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');

    app.enableCors({
        credentials: true,
        origin: ['http://localhost:4200'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie'],
    });

    useGlobalValidationPipe(app);

    app.use('/api/health', (req, res) => {
        res.send('healthy');
    });

    const config = new DocumentBuilder()
        .setTitle('Hackathon API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}

bootstrap();
