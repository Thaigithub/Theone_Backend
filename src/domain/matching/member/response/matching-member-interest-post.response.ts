import { ApiProperty } from '@nestjs/swagger';

export class MatchingMemberInterestPostResponse {
    @ApiProperty({ example: 'true' })
    isInterested: boolean;
}
