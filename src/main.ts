import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global filters
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors();

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Greenlabs API')
    .setDescription(
      'API documentation for Greenlabs backend with Vertical Slice Architecture',
    )
    .setVersion('1.0')
    .addTag('Authentication', 'Authentication and authorization endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Products', 'Product management endpoints')
    .addTag('Blog', 'Blog management endpoints')
    .addTag('CRM', 'Customer Relationship Management endpoints')
    .addTag('Notifications', 'In-app notification management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Scalar API documentation (alternative beautiful UI)
  const scalarConfig = {
    spec: {
      content: document,
    },
    theme: 'purple',
  };

  // You can access Scalar at /api/reference
  app.use('/api/reference', async (req: any, res: any) => {
    const html = `
<!doctype html>
<html>
  <head>
    <title>Greenlabs API Reference</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <script
      id="api-reference"
      data-url="/api/docs-json"
      data-configuration='${JSON.stringify(scalarConfig)}'
      ></script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`;
    res.send(html);
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`
🚀 Application is running!
───────────────────────────────────────────
📍 API Base URL:      http://localhost:${port}/api
📚 Swagger Docs:      http://localhost:${port}/api/docs
✨ Scalar Docs:       http://localhost:${port}/api/reference
───────────────────────────────────────────
  `);
}
bootstrap();
