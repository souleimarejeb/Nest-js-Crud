import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {

  console.log("process.env.DB_USERNAME:", process.env.DB_USERNAME)
  console.log("process.env.DB_NAME:", process.env.DB_NAME)

  console.log("process.env.DB_HOST:", process.env.DB_HOST)

  console.log("process.env.DB_PORT", process.env.DB_PORT)

  console.log("process.env.DB_PASSWORD", process.env.DB_PASSWORD)

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
