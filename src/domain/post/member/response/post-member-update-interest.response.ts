import { ApiProperty } from '@nestjs/swagger';

export class PostMemberUpdateInterestResponse {
    @ApiProperty({ example: 'true' })
    public isInterested: boolean;
}
