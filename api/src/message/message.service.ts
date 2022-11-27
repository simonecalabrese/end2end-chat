import { Injectable } from '@nestjs/common';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './message.schema';
import { UserService } from '../user/user.service';
import * as crypto from 'crypto'

@Injectable()
export class MessageService {

  constructor(@InjectModel(Message.name) private messageModel: Model<MessageDocument>, protected userService: UserService) {}

  async create(createMessageDto, userReq) {
    const user = await this.userService.findOne({username: userReq.username})

    // const encryptedTextRecevier = crypto.publicEncrypt(
    //   {
    //     key: receiver.public_key,
    //     padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    //     oaepHash: "sha256",
    //   },
    //   // We convert the data string to a buffer using `Buffer.from`
    //   Buffer.from(createMessageDto.text)
    // );

    const mex = await new this.messageModel({
      text: createMessageDto.text,
      author: user.username,
      author_id: userReq.id,
      receiver: createMessageDto.receiver,
      copy: false
    }).save()

    // const encryptedTextCopy = crypto.publicEncrypt(
    //   {
    //     key: user.public_key,
    //     padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    //     oaepHash: "sha256",
    //   },
    //   // We convert the data string to a buffer using `Buffer.from`
    //   Buffer.from(createMessageDto.text)
    // );

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

  async findAll(username, user) {
    const messages = await this.messageModel.find({ $or: [ { author: user.username, receiver: username }, { author: username, receiver: user.username } ] }).exec()
    return messages
    //Temporary section----
    // const userReq = await this.userService.findOne({username: user.username})
    // messages.forEach(async el => {
    //   if(el.author == user.username && el.copy == true) {
    //     //This decryption should be made in the browser
    //     const decryptedText = await crypto.privateDecrypt(
    //       {
    //         key: userReq.private_key,
    //         // In order to decrypt the data, we need to specify the
    //         // same hashing function and padding scheme that we used to
    //         // encrypt the data in the previous step
    //         padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    //         oaepHash: "sha256",
    //       },
    //       Buffer.from(el.text, 'base64')
    //     );
    //     el.text = decryptedText+''
    //   }
    //   if(el.author == username && el.copy == false) {
    //     //This decryption should be made in the browser
    //     const decryptedText = await crypto.privateDecrypt(
    //       {
    //         key: userReq.private_key,
    //         // In order to decrypt the data, we need to specify the
    //         // same hashing function and padding scheme that we used to
    //         // encrypt the data in the previous step
    //         padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    //         oaepHash: "sha256",
    //       },
    //       Buffer.from(el.text, 'base64')
    //     );
    //     el.text = decryptedText+''
    //   }
    // })
    // return messages
    
    //--------
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
