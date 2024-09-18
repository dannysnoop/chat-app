import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IUserService } from './i.user.service';
import { CreateUserRequest, UserDto, UserRequest } from '../../DTO/user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { COMMON_MESSAGE } from '../../helper/message';
import { CurrentUser } from '../../decorator/user.decorator';
import { AuthGuard } from '../../guards/auth.guard';

import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { User } from '../../entities/user.entity';

@Controller('api/user')
@ApiTags('users')
@ApiBearerAuth()
// @UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(
    @Inject('IUserService') private readonly IUserService: IUserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  getAllUser(): Promise<User[]> {
    return this.IUserService.getAllUser();
  }

  @Post()
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: COMMON_MESSAGE.CREATED,
    type: UserDto,
  })
  @ApiBody({ type: CreateUserRequest })
  @ApiOperation({ summary: 'create user' })
  createUser(@Body() params: CreateUserRequest) {
    return this.IUserService.createUser(params);
  }
  @Get('/current-user')
  @ApiOperation({ summary: 'get user information' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: COMMON_MESSAGE.CREATED,
    type: UserDto,
  })
  @UseGuards(AuthGuard)
  getCurrentUser(@CurrentUser() user: UserDto) {
    const { id } = user;
    return this.IUserService.getUserById(+id);
  }
  @Get('/:id')
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: COMMON_MESSAGE.CREATED,
    type: UserDto,
  })
  getUserById(@Param('id') id: number) {
    return this.IUserService.getUserById(+id);
  }
}
