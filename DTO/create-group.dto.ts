import { ApiProperty } from "@nestjs/swagger";

export class CreateGroupRequest {
  @ApiProperty()
  name : string;
  @ApiProperty()
  memberIds: number[] = [];
}
