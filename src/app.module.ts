import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
