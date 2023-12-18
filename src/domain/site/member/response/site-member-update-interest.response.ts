import { ApiProperty } from '@nestjs/swagger';

export class SiteMemberUpdateInterestResponse {
    @ApiProperty({ example: 'true' })
    public isInterested: boolean;
}
