import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';

export type FriendDocument = Friend & Document;

@Schema()
export class Friend {

  @Prop({required: true, unique: true, type: MongooseSchema.Types.ObjectId, ref: 'User'})
  user_id: Types.ObjectId

  @Prop({required: true, unique: true})
  username: string;

  @Prop({required: true})
  public_key: string;

  @Prop({required: true, default: false})
  confirmed: boolean;

  @Prop({default: new Date()})
  created_at: Date;

}

export const FriendSchema = SchemaFactory.createForClass(Friend);