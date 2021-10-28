import { ClientsModule, Transport } from '@nestjs/microservices';
import { Inject, Module } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { EmailValidate } from 'src/validate/emailValidate.validate';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PasswordValidate } from 'src/validate/passwordValidate.validate';
import { UserController } from './user.controller';
import { UserSchema } from './schemas/user.schema';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'NOTIFY_SERVICE',
        useFactory: (configService: ConfigService) => {
          console.log(configService.get('NOTIFY_URL'));
          return {
            transport: Transport.RMQ,
            options: {
              urls: configService.get('NOTIFY_URL'),
              noAck: true,
              queue: configService.get('NOTIFY_QUEUE'),
              queueOptions: {
                durable: false,
                messageTtl: 40000,
              },
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, EmailValidate, PasswordValidate],
})
export class UserModule {}
