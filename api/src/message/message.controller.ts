import { Controller, Get, Post, Request, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  /* Send a new message to a friend */
  async create(@Body() createMessageDto: CreateMessageDto, @Request() req) {
    return await this.messageService.create(createMessageDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  /* Return all the messages of a specific user's chat
  *  @param :username is the chat's receiver */
  findAll(@Param('username') username: string, @Request() req) {
    return this.messageService.findAll(username, req.user);
  }
}
