import { Controller, Get, Post, Request, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createMessageDto : CreateMessageDto, @Request() req) {
    return await this.messageService.create(createMessageDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  findAll(@Param('username') username: string, @Request() req) {
    //username == receiver
    return this.messageService.findAll(username, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
