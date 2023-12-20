import { ApiProperty } from '@nestjs/swagger';
class Member {
    @ApiProperty({ type: String })
    name: string;
    @ApiProperty({ type: String })
    contact: string;
}
export class Team {
    @ApiProperty({ type: String })
    name: string;
    @ApiProperty({ type: Array<Member> })
    members: Member[];
}
