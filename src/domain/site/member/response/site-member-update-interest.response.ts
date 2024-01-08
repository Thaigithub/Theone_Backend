import { ApiProperty } from '@nestjs/swagger';

export class SiteMemberUpdateInterestResponse {
    @ApiProperty({ example: 'true' })
    isInterested: boolean;
}
