import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {

  @ApiProperty({required:true})
  recevier: string;

  @ApiProperty({required:true})
  text: string;
  
}
