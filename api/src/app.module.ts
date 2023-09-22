import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [AuthModule, UserModule, MongooseModule.forRoot(process.env.MONGO_DB_URL), MessageModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule { }
