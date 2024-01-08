import { ApiProperty } from '@nestjs/swagger';
import { Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class SiteResponse {
    @ApiProperty({ type: 'string', example: 'SamSung' })
    name: string;

    @ApiProperty({ type: 'string', example: '101-dong, 42 Seolleung-ro 90-gil, Gangnam-gu, Seoul' })
    address: string;

    @ApiProperty({ type: Date, example: 'YYYY-MM-DD' })
    startDate: Site['startDate'];

    @ApiProperty({ type: Date, example: 'YYYY-MM-DD' })
    endDate: Site['endDate'];

    @ApiProperty({ type: 'string', example: 'On-site representative name' })
    personInCharge: string;

    @ApiProperty({ type: 'string', example: 'On-site contact information' })
    personInChargeContact: string;

    @ApiProperty({ type: 'string', example: 'Contact Information' })
    contact: string;

    @ApiProperty({ type: Number, example: 1 })
    countPost: number;

    @ApiProperty({ type: 'string', example: 'File name' })
    logoFileName: string;

    @ApiProperty({ type: 'string', example: 'File key' })
    logoFileKey: string;

    @ApiProperty({ type: 'string', example: 'File type' })
    logoFileType: string;

    @ApiProperty({ type: BigInt, example: 'File size' })
    logoFileSize: bigint;
}

export class SiteMemberGetListResponse extends PaginationResponse<SiteResponse> {}
