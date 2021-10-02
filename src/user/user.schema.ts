import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Friend } from './friend.schema'

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({required: true, unique: true})
  username: string;

  @Prop({required: true, unique: true})
  email: string;

  @Prop()
  friends: Array<Friend>;

  @Prop()
  public_key: string;

  @Prop()
  private_key: string;

  @Prop({required: true})
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);