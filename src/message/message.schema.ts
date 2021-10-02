import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({required: true})
  author: string;

  @Prop({ required: true })
  receiver: string 

  @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'User' })
  author_id:  Types.ObjectId 

  @Prop({ type: MongooseSchema.Types.ObjectId , ref: 'Message' })
  mex_id:  Types.ObjectId 

  @Prop({required: true})
  text: string;

  @Prop({required: true})
  copy: boolean

  @Prop({default: new Date()})
  created_at: Date
}

export const MessageSchema = SchemaFactory.createForClass(Message);