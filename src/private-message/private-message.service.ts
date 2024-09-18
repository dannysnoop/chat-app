import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrivateMessageRepository } from './private-message.repository';
import { CreatePrivateMessageRequest } from '../../DTO/create-private-message.dto';
import { UserRepository } from '../user/user.repository';
import { UserDto } from '../../DTO/user.dto';
import { COMMON_MESSAGE } from '../../helper/message';
import { plainToInstance } from 'class-transformer';
import { PrivateMessage } from '../../entities/private-message.entity';
import {
  PrivateMassageRequest,
  PrivateMessageResponse,
} from '../../DTO/private-massage.dto';
import { User } from '../../entities/user.entity';
import { Response } from '../../DTO/response-base.dto';

@Injectable()
export class PrivateMessageService {
  constructor(
    private message: PrivateMessageRepository,
    private userRepository: UserRepository,
  ) {}
  async createPrivateMessage(
    user: UserDto,
    params: CreatePrivateMessageRequest,
  ): Promise<PrivateMessageResponse> {
    const { recipientId, content } = params;
    const recipient = await this.userRepository.findOne({
      where: { id: recipientId },
    });
    if (!recipient) {
      throw new HttpException(
        COMMON_MESSAGE.USER_NOT_FOUND,
        HttpStatus.FORBIDDEN,
      );
    }
    const sender = plainToInstance(User, user);
    const privateMessage = plainToInstance(PrivateMessage, {
      sender,
      recipient,
      content,
    });

    const message = await this.message.save(privateMessage);

    return new PrivateMessageResponse(message);
  }

  async getGroupChatHistory(
    user: UserDto,
    params: PrivateMassageRequest,
  ): Promise<Response<PrivateMessage>> {
    const { recipentId, take = 10, page = 1 } = params;
    const skip = (page - 1) * take || 0;

    const recipient = await this.userRepository.findOne({
      where: { id: recipentId },
    });
    if (!recipient) {
      throw new HttpException(
        COMMON_MESSAGE.USER_NOT_FOUND,
        HttpStatus.FORBIDDEN,
      );
    }

    const [data, count] = await this.message.findAndCount({
      where: { sender: { id: user.id }, recipient },
      order: { createdAt: 'ASC' },
      relations: ['sender', 'recipient'],
      take,
      skip,
    });
    return new Response<PrivateMessage>(data, page, take, count)
  }
}
