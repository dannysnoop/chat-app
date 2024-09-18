import { ApiProperty } from "@nestjs/swagger";

export class RenameGroupRequest {
  @ApiProperty()
  name: string;
}

export class RenameGroupResponse {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
