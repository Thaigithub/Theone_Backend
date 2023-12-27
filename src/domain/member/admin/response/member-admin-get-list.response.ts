import { ApiProperty } from '@nestjs/swagger';
import { Account, AccountStatus, Member, MemberLevel } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class MemberResponse {
    @ApiProperty({ type: 'string' })
    id: Member['id'];

    @ApiProperty({ type: 'string' })
    name: Member['name'];

    @ApiProperty({ type: 'string' })
    contact: Member['contact'];

    @ApiProperty({
        type: 'string',
        example: [...Object.values(MemberLevel)],
    })
    level: Member['level'];

    @ApiProperty({
        type: 'object',
        properties: {
            username: {
                type: 'string',
            },
            status: {
                type: 'string',
                example: [...Object.values(AccountStatus)],
            },
        },
    })
    account: {
        username: Account['username'];
        status: Account['status'];
    };
}

export class MemberAdminGetListResponse extends PaginationResponse<MemberResponse> {}
