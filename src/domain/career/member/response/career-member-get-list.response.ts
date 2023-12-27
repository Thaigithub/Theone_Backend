import { ApiProperty } from '@nestjs/swagger';
import { Career, CareerType, Code } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class CareerResponse {
    @ApiProperty({ type: 'number' })
    id: Career['id'];

    @ApiProperty({
        type: 'string',
        example: [...Object.values(CareerType)],
    })
    type: Career['type'];

    @ApiProperty({ type: 'string' })
    companyName: Career['companyName'];

    @ApiProperty({ type: 'string' })
    siteName: Career['siteName'];

    @ApiProperty({ type: 'string', format: 'date' })
    startDate: Career['startDate'];

    @ApiProperty({ type: 'string', format: 'date' })
    endDate: Career['endDate'];

    @ApiProperty({ type: 'string' })
    occupation: Code;

    @ApiProperty({ type: 'boolean' })
    isExperienced: Career['isExperienced'];
}

export class CareerMemberGetListResponse extends PaginationResponse<CareerResponse> {}
