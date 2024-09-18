import { ROLE } from '../helper/constant';
import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
export class UserDto {
  id: number;
  username: string;
  role: ROLE;
  email: string;
}
export class UserResponse {
  id: number;
  username: string;
  constructor(username = '' , id  = 0) {
    this.username = username;
    this.id = id;
  }
}

export class UserRequest {
  username = '';
  take = 10;
  page = 1;
}
export class UserResetPassRequest {
  @ApiProperty()
  email: string;
}

export class UserOTPRequest {
  @ApiProperty()
  otp: string;
}


export class CreateUserRequest {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
}

export class UpdateUserRequest {
  @ApiProperty()
  password: string;
  @ApiProperty()
  confirmPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  currentPassword: string;
  @ApiProperty()
  newPassword: string;
}
