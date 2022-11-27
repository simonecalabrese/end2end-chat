import { Controller, Request, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UserService } from './user/user.service'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  @Post('auth/register')
  async register(@Request() req) {
    if(await this.userService.findOne({username:req.body.username}) != null) {
      return {message: "Your username has already been taken", error: true}
    }
    if(await this.userService.findOne({email:req.body.email}) != null) {
      return {message: "Your email has already been registered", error: true}
    }
    return await this.authService.register(req.body);
  }

  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.findOne({username:req.user.username});
  }

  @Get('/')
  getHome() {
    return this.appService.getHello();
  }

}
