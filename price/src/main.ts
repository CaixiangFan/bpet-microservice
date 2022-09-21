import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.TCP
  //   });
  // await app.listen();
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    options: {
      port: 3005,
    },
  });
  app.startAllMicroservices();
}
bootstrap();
