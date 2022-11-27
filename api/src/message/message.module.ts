import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './message.schema';
import { User, UserSchema } from '../user/user.schema';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }, {name: User.name, schema: UserSchema}])],
  controllers: [MessageController],
  providers: [MessageService, UserService]
})
export class MessageModule {}
