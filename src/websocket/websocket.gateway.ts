import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from '../../lib/redis.service';
import { preUserToken } from '../../utility/random-character';
import { GroupService } from '../group/group.service';
import { PrivateMessageService } from '../private-message/private-message.service';
import { SendGroupMessageDto } from '../../DTO/send-group-message.dto';
import { CreatePrivateMessageRequest } from '../../DTO/create-private-message.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jwt = require('jsonwebtoken');
@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(
    private redis: RedisService,
    private groupChat: GroupService,
    private privateMessage: PrivateMessageService,
  ) {}

  // Middleware to authenticate the WebSocket connection
  async handleConnection(client: Socket) {
    const token = client.handshake?.query?.token;
    if (!token) {
      client.disconnect(true);
      return;
    }

    try {
      const tokenUserRedis = await this.redis.get(preUserToken(token));
      if(!tokenUserRedis) {
        client.disconnect(true);
        return
      }
      client.data.user = jwt.verify(tokenUserRedis, process.env.JWT_SECRET); // Attach the user data to the socket
    } catch (error) {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  afterInit(server: Server) {
    console.log('WebSocket Gateway Initialized');
  }

  // Example of sending a private message
  @SubscribeMessage('send_group_message')
  async handleGroupMessage(
    @MessageBody() data: SendGroupMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user; // Access the authenticated user

    if (user) {
      const message = await this.groupChat.sendGroupMessage(user, data);

      // Emit the message to the group
      this.server
        .to(`group_${data.groupId}`)
        .emit('receive_group_message', message);
    }
  }
  @SubscribeMessage('send_private_message')
  async handlePrivateMessage(
    @MessageBody() data: CreatePrivateMessageRequest,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client.data.user; // Access the authenticated user

    if (user) {
      // Save the private message to the database
      const message = await this.privateMessage.createPrivateMessage(
        user,
        data,
      );
      // Emit the message to the recipient
      this.server
        .to(`private_${user.id}_${data.recipientId}`)
        .emit('receive_private_message', message);
    }
  }
}
