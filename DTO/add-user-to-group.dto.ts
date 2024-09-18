import { ApiProperty } from "@nestjs/swagger";

export class AddUserToGroupRequest {
  @ApiProperty()
  groupId: number;
  @ApiProperty()
  userIds: number[];
}
