import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt'
import { bcryptSaltRounds } from '../auth/constants';
import * as crypto from 'crypto'

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: User): Promise<any> {
    const app = this
    //Genereate Key pair
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      }
    });
    //Password
    let passwdHashed = ''
    await bcrypt.hash(user.password, bcryptSaltRounds).then(async function(hash) {
      passwdHashed = hash
    });
    //Create user
    return await new app.userModel({
      name: user.name,
      username: user.username,
      email: user.email,
      password: passwdHashed,
      public_key: publicKey,
      private_key: privateKey
    }).save()
  }

  async hashCompare(reqPass, dbPass) {
    let result = false
    await bcrypt.compare(reqPass, dbPass).then(function(res) {
        result = res
    });
    return result
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(query:any): Promise<User> {
    return this.userModel.findOne(query).exec();
  }

  async inviteFriend(body, user): Promise<any> {
    const receiver = await this.userModel.findOne({username: body.username})
    if(receiver == null) {
      return {message: "Can't find a user with that username", error: true}
    }
    else if(receiver.username === user.username) {
      return {message: "You can't invite yourself", error: true}
    }
    else if(receiver.friends.find(el => el.user_id === user.id) !== undefined) {
      return {message: "You have already invited him, or he invited you.", error: true}
    }
    else {
      //Update receiver's friends
      const reqUser = await this.userModel.findOne({_id: user.id})
      await this.userModel.updateOne({username: body.username}, { $push: { 
        friends: {
          user_id: user.id,
          username: user.username,
          public_key: reqUser.public_key,
          confirmed: false,
          hasInvited: false,
          created_at: new Date()
        }
      }})

      //Update and return user's friends
      let res = await this.userModel.findOne({username: user.username})
      const friend = {
        user_id: receiver.id,
        username: receiver.username,
        public_key: receiver.public_key,
        confirmed: false,
        hasInvited: true,
        created_at: new Date()
      }
      res.friends.push(friend)
      await res.save()
      
      return friend
    }
  }

  async acceptInvite(body, user) {
    let receiver = await this.userModel.findOne({username: body.username})
    let userInReceiverFriends = receiver.friends.find(el => el.username == user.username)
    if(receiver == null) {
      return {message: "Can't find a user with that username", error: true}
    }
    else if(userInReceiverFriends.hasInvited === false) {
      return {message: "Can't auto-accept your invite", error:true}
    }
    else if(userInReceiverFriends === undefined) {
      return {message: "That user has never invited you.", error: true}
    }
    else if(userInReceiverFriends.confirmed === true) {
      return {message: "You are already friends!", error: true}
    }
    else {
      //Update receiver's friends
      userInReceiverFriends.confirmed = true
      receiver.markModified('friends');
      await receiver.save()

      //Update and return user's 
      let res = await this.userModel.findOne({username: user.username})
      res.friends.find(el => el.username == body.username).confirmed = true
      res.markModified('friends');
      await res.save()
      
      return res.friends
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
