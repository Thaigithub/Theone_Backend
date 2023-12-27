import { ApiProperty } from '@nestjs/swagger';

export class MatchingMemberInterestPostResponse {
    @ApiProperty({ example: 'true' })
    public isInterested: boolean;
}
