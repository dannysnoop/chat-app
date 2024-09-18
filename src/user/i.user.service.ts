import {
  CreateUserRequest,
  UpdateUserRequest,
  UserDto,
  UserResponse,
} from '../../DTO/user.dto';
import { User } from '../../entities/user.entity';
import { UserLoginDto } from '../../DTO/user-login.dto';

export interface IUserService {
  createUser(params: CreateUserRequest): Promise<UserResponse>;
  updateUser(user: UserDto, params: UpdateUserRequest): Promise<UserResponse>;
  getUserById(id: number): Promise<User>;
  checkUserByEmailAndPassword(user: UserLoginDto): Promise<User>;
  getAllUser(): Promise<User[]>
}
