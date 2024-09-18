import { HttpException, HttpStatus } from '@nestjs/common';

import { Group } from '../../entities/group.entity';
import { Message } from '../../entities/message.entity';
import { GroupRepository } from './group.repository';
import { UserRepository } from '../user/user.repository';
import { In, Repository } from 'typeorm';
import { COMMON_MESSAGE } from '../../helper/message';
import { CreateGroupRequest } from '../../DTO/create-group.dto';
import { randomCharacter } from '../../utility/random-character';
import {
  RenameGroupRequest,
  RenameGroupResponse,
} from '../../DTO/rename-group.dto';
import { SendGroupMessageDto } from '../../DTO/send-group-message.dto';
import { IGroupService } from './i.group.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from '../../DTO/user.dto';
import { GroupMessageDto } from '../../DTO/group-message.dto';
import { AddUserToGroupRequest } from '../../DTO/add-user-to-group.dto';
import { Response } from '../../DTO/response-base.dto';

export class GroupService implements IGroupService {
  constructor(
    private groupRepository: GroupRepository,
    private userRepository: UserRepository,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  // Create a new group
  async createGroup(params: CreateGroupRequest): Promise<Group> {
    // eslint-disable-next-line prefer-const
    let { name, memberIds } = params;
    if (!name) {
      name = randomCharacter(5);
    }
    const members = await this.userRepository.find({
      where: { id: In(memberIds) },
    });
    const group = new Group();
    group.members = members;
    group.name = name;
    return this.groupRepository.save(group);
  }

  // Add users to an existing group
  async addUsersToGroup(params: AddUserToGroupRequest): Promise<Group> {
    const { groupId, userIds } = params;
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: { members: true },
    });
    if (!group) {
      throw new HttpException(
        COMMON_MESSAGE.GROUP_NOT_FOUND,
        HttpStatus.FORBIDDEN,
      );
    }

    const users = await this.userRepository.find({
      where: { id: In(userIds) },
    });
    group.members = [...group.members, ...users];
    return this.groupRepository.save(group);
  }

  async renameGroup(
    user: UserDto,
    params: RenameGroupRequest,
    groupId: number,
  ): Promise<RenameGroupResponse> {
    const { name } = params;
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: { members: true },
    });
    if (!group) {
      throw new HttpException(
        COMMON_MESSAGE.GROUP_NOT_FOUND,
        HttpStatus.FORBIDDEN,
      );
    }
    const checkUserBelongGroup = group?.members.find(
      (member) => member.id == user.id,
    );
    if (!checkUserBelongGroup) {
      throw new HttpException(
        COMMON_MESSAGE.USER_NOT_IN_GROUP,
        HttpStatus.FORBIDDEN,
      );
    }
    group.name = name;
    const data = await this.groupRepository.save(group);
    try {
      return new RenameGroupResponse(data.name);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.FORBIDDEN);
    }
  }

  // Send a message to a group
  async sendGroupMessage(
    sender: UserDto,
    params: SendGroupMessageDto,
  ): Promise<Message> {
    const { groupId, content } = params;
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });

    if (!group) {
      throw new HttpException(
        COMMON_MESSAGE.GROUP_NOT_FOUND,
        HttpStatus.FORBIDDEN,
      );
    }
    const newMessage = this.messageRepository.create({
      sender,
      group,
      content,
    });
    return this.messageRepository.save(newMessage);
  }

  // Get group message history
  async getGroupChatHistory(
    user: UserDto,
    params: GroupMessageDto,
  ): Promise<Response<Message>> {
    const { groupId, page = 1, take = 10 } = params;

    const skip = (page - 1) * take || 0;
    const userDb = await this.userRepository.findOne({
      where: { id: user.id },
      relations: { groups: true },
    });

    const checkUserValid = userDb.groups.find((group) => group.id == groupId);
    if (!checkUserValid) {
      throw new HttpException(
        COMMON_MESSAGE.USER_NOT_IN_GROUP,
        HttpStatus.FORBIDDEN,
      );
    }

    const [messages, total] = await this.messageRepository.findAndCount({
      where: { group: { id: groupId } },
      order: { createdAt: 'ASC' },
      take,
      skip,
      relations: ['sender'],
    });
    return new Response<Message>(messages, page, take, total);
  }
}
