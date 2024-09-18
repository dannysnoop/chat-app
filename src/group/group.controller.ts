import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query, UseGuards
} from "@nestjs/common";
import { IGroupService } from './i.group.service';
import { CurrentUser } from '../../decorator/user.decorator';
import { UserDto } from '../../DTO/user.dto';
import { GroupMessageDto } from '../../DTO/group-message.dto';
import { SendGroupMessageDto } from '../../DTO/send-group-message.dto';
import { RenameGroupRequest } from '../../DTO/rename-group.dto';
import { CreateGroupRequest } from '../../DTO/create-group.dto';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { COMMON_MESSAGE } from '../../helper/message';
import { AddUserToGroupRequest } from "../../DTO/add-user-to-group.dto";
import { AuthGuard } from "../../guards/auth.guard";

@Controller('group')
@ApiTags('group')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class GroupController {
  constructor(
    @Inject('IGroupService') private readonly IGroupService: IGroupService,
  ) {}

  @Get()
  @ApiQuery({ name: 'groupId', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiOperation({ summary: 'get chat on group' })
  getGroupMessage(
    @CurrentUser() user: UserDto,
    @Query() params: GroupMessageDto,
  ) {
    return this.IGroupService.getGroupChatHistory(user, params);
  }

  @Post()
  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: COMMON_MESSAGE.CREATED,
  })
  @ApiBody({ type: CreateGroupRequest })
  @ApiOperation({ summary: 'create group chat' })

  createGroup(
    @CurrentUser() user: UserDto,
    @Body() params: CreateGroupRequest,
  ) {
    return this.IGroupService.createGroup(params);
  }
  @Post('/message')
  @ApiOperation({ summary: 'send message on group' })
  @ApiBody({ type: SendGroupMessageDto })
  sendMessageToGroup(
    @CurrentUser() user: UserDto,
    @Body() params: SendGroupMessageDto,
  ) {
    return this.IGroupService.sendGroupMessage(user, params);
  }
  @Put('rename/:id')
  @ApiOperation({ summary: 'rename group by members' })

  @ApiBody({ type: RenameGroupRequest })
  renameGroup(
    @Param('id') id: number,
    @CurrentUser() user: UserDto,
    @Body() params: RenameGroupRequest,
  ) {
    return this.IGroupService.renameGroup(user, params, id);
  }

  @Post('/add-user')
  @ApiOperation({ summary: 'add people on group' })

  @ApiCreatedResponse({
    status: HttpStatus.OK,
    description: COMMON_MESSAGE.CREATED,
  })
  @ApiBody({ type: AddUserToGroupRequest })
  addUserToGroup(@Body() params: AddUserToGroupRequest) {
    return this.IGroupService.addUsersToGroup(params);
  }
}
