import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { IUserService } from './i.user.service';
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
  UserDto,
} from 'DTO/user.dto';
import { User } from 'entities/user.entity';
import { COMMON_MESSAGE } from '../../helper/message';
import { plainToInstance } from 'class-transformer';
import { comparePassword, hashPassword } from '../../utility/handle-password';
import { UserLoginDto } from '../../DTO/user-login.dto';

@Injectable()
export class UserService implements IUserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(params: CreateUserRequest): Promise<UserResponse> {
    const { username, password } = params;
    if (!username) {
      throw new HttpException(
        COMMON_MESSAGE.USER_NAME_REQUIRED,
        HttpStatus.FORBIDDEN,
      );
    }
    const userEntity = plainToInstance(User, {
      username,
      password: hashPassword(password),
    });
    const user = await this.userRepository.save(userEntity);
    return new UserResponse(user.username, user.id);
  }
  async updateUser(
    user: UserDto,
    params: UpdateUserRequest,
  ): Promise<UserResponse> {
    const userEntity = plainToInstance(User, { ...user, ...params });
    const userOut = await this.userRepository.save(userEntity);
    return new UserResponse(userOut.username, userOut.id);
  }

  getUserById(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }
  getAllUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  async checkUserByEmailAndPassword(user: UserLoginDto) {
    const { username, password } = user;
    const userDb = await this.userRepository.findOne({
      where: { username },
    });
    if (!userDb) {
      throw new HttpException(COMMON_MESSAGE.LOGIN_FAIL, HttpStatus.FORBIDDEN);
    }
    const check = comparePassword(userDb.password, password);
    if (!check) {
      throw new HttpException(COMMON_MESSAGE.LOGIN_FAIL, HttpStatus.FORBIDDEN);
    }
    return userDb;
  }
}
