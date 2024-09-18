import { ApiProperty } from '@nestjs/swagger';
import { PrivateMessage } from '../entities/private-message.entity';

export class PrivateMassageRequest {
  @ApiProperty()
  recipentId = 0;
  @ApiProperty()
  take = 0;
  @ApiProperty()
  page = 0;
}

export class PrivateMessageResponse {
  sender: {
    name: string;
    id: number;
  };
  recipient: {
    name: string;
    id: number;
  };
  content: string;
  createdAt: Date;
  constructor(message: PrivateMessage) {
    console.log(message)
    this.sender = {
      name: message.sender.username,
      id: message.sender.id,
    };
    this.recipient = {
      name: message.recipient.username,
      id: message.recipient.id,
    };
    this.content = message.content;
    this.createdAt = message.createdAt;
  }
}
