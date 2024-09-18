import { Group } from '../../entities/group.entity';
import { CreateGroupRequest } from '../../DTO/create-group.dto';
import {
  RenameGroupRequest,
  RenameGroupResponse,
} from '../../DTO/rename-group.dto';
import { SendGroupMessageDto } from '../../DTO/send-group-message.dto';
import { Message } from '../../entities/message.entity';
import { UserDto } from '../../DTO/user.dto';
import { GroupMessageDto } from '../../DTO/group-message.dto';
import { AddUserToGroupRequest } from "../../DTO/add-user-to-group.dto";
import { Response } from "../../DTO/response-base.dto";

export interface IGroupService {
  createGroup(params: CreateGroupRequest): Promise<Group>;
  addUsersToGroup( params: AddUserToGroupRequest): Promise<Group>;
  renameGroup(
    user: UserDto,
    params: RenameGroupRequest,
    groupId: number
  ): Promise<RenameGroupResponse>;
  sendGroupMessage(
    sender: UserDto,
    params: SendGroupMessageDto,
  ): Promise<Message>;
  getGroupChatHistory(
    user: UserDto,
    params: GroupMessageDto,
  ): Promise<Response<Message>>;
}
