import { PartialType } from '@nestjs/mapped-types';
import { User } from '../user.schema'

export class UpdateUserDto extends PartialType(User) {}
