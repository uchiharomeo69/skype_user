import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AccessModule } from './access/access.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AccessModule,
    ContactModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
