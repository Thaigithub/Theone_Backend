import { ApiProperty } from '@nestjs/swagger';
import { Career, CareerType } from '@prisma/client';

export class CareerResponse {
    @ApiProperty({ type: 'string' })
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

    @ApiProperty({ type: 'date' })
    startDate: Career['startDate'];

    @ApiProperty({ type: 'date' })
    endDate: Career['endDate'];

    @ApiProperty({ type: 'string' })
    occupation: Career['occupation'];

    @ApiProperty({ type: 'boolean' })
    isExperienced: Career['isExperienced'];
}

export class GetCareerListResponse {
    @ApiProperty({ type: () => [CareerResponse] })
    list: CareerResponse[];

    @ApiProperty({
        type: 'number',
        examples: [0, 1, 2],
    })
    total: number;

    constructor(list: CareerResponse[], total: number) {
        this.list = list;
        this.total = total;
    }
}
