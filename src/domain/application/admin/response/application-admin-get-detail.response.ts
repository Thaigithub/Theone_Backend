import { ApiProperty } from '@nestjs/swagger';
import { ContractStatus, PostApplicationStatus } from '@prisma/client';

export class ApplicationAdminGetDetailResponse {
    @ApiProperty({
        type: 'enum',
        example: '010-0000-0000',
    })
    public status: PostApplicationStatus;

    @ApiProperty({
        type: 'string',
        example: 'Dewon Kim',
    })
    public name: string;

    @ApiProperty({
        type: Boolean,
        example: false,
    })
    public isTeam: boolean;

    @ApiProperty({
        type: 'string',
        example: '010-0000-0000',
    })
    public contact: string;

    @ApiProperty({
        type: 'string',
        example: 'example',
    })
    public leaderName: string;

    @ApiProperty({
        type: 'enum',
        example: ContractStatus.DROP_BOX,
        description: 'The contract status may be null',
    })
    public contractStatus: ContractStatus;

    @ApiProperty({ type: Date, example: 'YYYY-MM-DD' })
    public startDate: Date;

    @ApiProperty({ type: Date, example: 'YYYY-MM-DD' })
    public endDate: Date;

    @ApiProperty({ type: Date, example: 'YYYY-MM-DD' })
    public interviewRequestDate: Date;
}
