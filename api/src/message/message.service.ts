import { Injectable } from '@nestjs/common';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './message.schema';
import { UserService } from '../user/user.service';

@Injectable()
export class MessageService {

  constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>, protected userService: UserService) { }

  /* Store a new sent message inside the database. To keep end-to-end security
  *  for each sent message the server stores two's copy of the message:
  *   - a sender's copy encrypted with sender's Public key;
  *   - a receiver's copy encrypted with receiver's Public key.
  * Messages are already encrypted client-side because only there the user's Private
  * key will be decrypted and used to decrypt all the messages. */
  async create(createMessageDto, userReq) {
    const user = await this.userService.findOne({ username: userReq.username })

    const mex = await new this.messageModel({
      text: createMessageDto.text,
      author: user.username,
      author_id: userReq.id,
      receiver: createMessageDto.receiver,
      copy: false
    }).save()

    const copy = await new this.messageModel({
      text: createMessageDto.textCopy,
      mex_id: mex.id,
      author: user.username,
      author_id: userReq.id,
      receiver: createMessageDto.receiver,
      copy: true
    }).save()

    return {
      mex: mex,
      copy: copy
    }
  }

  /* Return all the encrypted messages for a specific user's chat that will be
  *  decrypted client-side for keeping end-to-end security */
  async findAll(username, user) {
    const messages = await this.messageModel.find({ $or: [{ author: user.username, receiver: username }, { author: username, receiver: user.username }] }).exec()
    return messages
  }

}
