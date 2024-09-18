import { ApiProperty } from "@nestjs/swagger";

export class SendGroupMessageDto {
  @ApiProperty()
  groupId: number;
  @ApiProperty()
  content: string;
}
