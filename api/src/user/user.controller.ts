import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async index() {
    return await this.userService.findAll()
  }

  @UseGuards(JwtAuthGuard)
  @Post('friends/invite')
  /* Send a friend request */
  async inviteFriend(@Request() req) {
    try {
      return await this.userService.inviteFriend(req.body, req.user)
    }
    catch {
      return { message: "Error during inviting the user", error: true }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('friends/add')
  /* Accept a received invite */
  async addFriend(@Request() req) {
    return await this.userService.acceptInvite(req.body, req.user)
  }

  @Post('friends/deny')
  /* Reject a received invite */
  async rejectInvite() {
    return 'This route will be available in future'
  }

  @Post('friends/remove')
  /* Remove a friend */
  async removeFriend() {
    return 'This route will be available in future'
  }
}
