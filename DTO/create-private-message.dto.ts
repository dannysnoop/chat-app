import { ApiProperty } from "@nestjs/swagger";

export class CreatePrivateMessageRequest {
  @ApiProperty()
  content : string
  @ApiProperty()
  recipientId : number
}