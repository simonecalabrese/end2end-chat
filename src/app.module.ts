import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [AuthModule, UserModule, MongooseModule.forRoot('mongodb://localhost/end2end-chat-api'), MessageModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
