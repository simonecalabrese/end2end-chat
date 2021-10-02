import { Controller, Get, Post, Request, UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async index() {
    return await this.userService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Post('friends/invite')
  async inviteFriend(@Request() req) {
    //Invite
    // try {
      return await this.userService.inviteFriend(req.body, req.user)
    // }
    // catch {
    //   return {message: "Error during inviting the user", error: true}
    // }
  }

  @UseGuards(JwtAuthGuard)
  @Post('friends/add')
  async addFriend(@Request() req) {
    //Accept Invite
    return await this.userService.acceptInvite(req.body, req.user)
  }

  @Post('friends/deny')
  async rejectInvite() {
    //Reject Invite
    return 'This route will be available in future'
  }

  @Post('friends/remove')
  async removeFriend() {
    //Remove friend
    return 'This route will be available in future'
  }
}
