import { ApiProperty } from '@nestjs/swagger';

export class MemberMemebrUpdateInterestResponse {
    @ApiProperty({ example: 'true' })
    public isInterested: boolean;
}
