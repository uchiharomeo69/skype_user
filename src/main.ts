import { MicroserviceOptions, Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from './pipe/validation.pipe';
import { join } from 'path';
import { useContainer } from 'class-validator';

async function boostrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: `0.0.0.0:5000`,
        package: 'user',
        protoPath: join(__dirname, 'proto', 'user.proto'),
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe());
  useContainer(app.select(AppModule), { fallbackOnErrors: true }); // cho phep class-validator dung nestjs dependance injection
  await app
    .listen()
    .then(() => {
      console.log('app start');
    })
    .catch((err) => {
      console.log('loi cmnr', err);
    });
}

boostrap();
