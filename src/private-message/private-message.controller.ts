import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PrivateMessageService } from './private-message.service';
import { CurrentUser } from '../../decorator/user.decorator';
import { CreateUserRequest, UserDto } from '../../DTO/user.dto';
import { PrivateMassageRequest } from '../../DTO/private-massage.dto';
import { CreatePrivateMessageRequest } from '../../DTO/create-private-message.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from '../../guards/auth.guard';

@Controller('private-message')
@ApiTags('private-message')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class PrivateMessageController {
  constructor(private service: PrivateMessageService) {}

  @Get()
  @ApiQuery({ name: 'recipentId', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiOperation({ summary: 'get message 1 1 with user' })

  getPrivateMessage(
    @CurrentUser() user: UserDto,
    @Query() params: PrivateMassageRequest,
  ) {
    return this.service.getGroupChatHistory(user, params);
  }

  @Post()
  @ApiBody({ type: CreatePrivateMessageRequest })
  @ApiOperation({ summary: 'send message to user' })

  createPrivateMessage(
    @CurrentUser() user: UserDto,
    @Body() params: CreatePrivateMessageRequest,
  ) {
    return this.service.createPrivateMessage(user, params);
  }
}
