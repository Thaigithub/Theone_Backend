import { ApiProperty } from '@nestjs/swagger';

class SiteDetailResponse {
    @ApiProperty({ type: 'string', example: 'Site Name' })
    name: string;

    @ApiProperty({ type: 'string', example: '0000 street, 00-dong, 00-gu, 00:00' })
    address: string;

    @ApiProperty({ type: Boolean, example: false })
    isInterest: boolean;

    @ApiProperty({ type: Date, example: 'YYYY-MM-DD' })
    startDate: Date;

    @ApiProperty({ type: Date, example: 'YYYY-MM-DD' })
    endDate: Date;

    @ApiProperty({ type: 'string', example: 'Name of person in charge' })
    personInCharge: string;

    @ApiProperty({ type: 'string', example: 'Contact person in charge' })
    personInChargeContact: string;

    @ApiProperty({ type: 'string', example: 'contact' })
    contact: string;
}

class CompanyDetailResponse {
    @ApiProperty({ type: 'string', example: 'Company Name' })
    name: string;

    @ApiProperty({ type: 'string', example: '0000 street, 00-dong, 00-gu, 00:00' })
    address: string;

    @ApiProperty({ type: 'string', example: 'File name' })
    logoFileName: string;

    @ApiProperty({ type: 'string', example: 'File key' })
    logoFileKey: string;

    @ApiProperty({ type: 'string', example: 'File type' })
    logoFileType: string;

    @ApiProperty({ type: BigInt, example: 'File size' })
    logoFileSize: bigint;

    @ApiProperty({ type: 'string', example: 'Name of The presentative' })
    presentativeName: string;

    @ApiProperty({ type: 'string', example: 'email address' })
    email: string;

    @ApiProperty({ type: 'string', example: 'Phone' })
    contactPhone: string;
}

export class SiteMemberGetDetailResponse {
    @ApiProperty({
        type: SiteDetailResponse,
    })
    site: SiteDetailResponse;

    @ApiProperty({
        type: CompanyDetailResponse,
    })
    company: CompanyDetailResponse;
}
