import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/user.schema'
import { JwtService } from '@nestjs/jwt';
import { userInfo } from 'os';
import * as bcrypt from 'bcrypt'
import { bcryptSaltRounds } from './constants';



@Injectable()
export class AuthService {
  constructor(private usersService: UserService, private jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<User> {
    const user = await this.usersService.findOne({username:username});
    if (user && user.password === pass) {
      return user
    }
    return null;
  }

  async register(user: any) {
    const res = await this.usersService.create(user)
    return (res != null) ? res : {message:"Error while creating new user", error: true}
  }

  async login(user: any) {
    const userDB:any = await this.usersService.findOne({username:user.username})
    if(userDB == null) {
      return {message:"That username has never been registered", error: true}
    }
    else {
      const payload = { username: user.username, id: userDB._id };
      if(await this.usersService.hashCompare(user.password, userDB.password) === false) {
        return {message: "Password wrong for that username", error: true}
      }
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
  }
}