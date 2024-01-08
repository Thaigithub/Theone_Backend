import { ApiProperty } from '@nestjs/swagger';

export class PostMemberUpdateInterestResponse {
    @ApiProperty({ example: 'true' })
    isInterested: boolean;
}
