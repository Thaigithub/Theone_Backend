import { ApiProperty } from '@nestjs/swagger';

class SiteDetailResponse {
    @ApiProperty({ type: 'string', example: 'Site Name' })
    public name: string;

    @ApiProperty({ type: 'string', example: '0000 street, 00-dong, 00-gu, 00:00' })
    public address: string;

    @ApiProperty({ type: Boolean, example: false })
    public isInterest: boolean;

    @ApiProperty({ type: Date, example: 'YYYY-MM-DD' })
    public startDate: Date;

    @ApiProperty({ type: Date, example: 'YYYY-MM-DD' })
    public endDate: Date;

    @ApiProperty({ type: 'string', example: 'Name of person in charge' })
    public personInCharge: string;

    @ApiProperty({ type: 'string', example: 'Contact person in charge' })
    public personInChargeContact: string;

    @ApiProperty({ type: 'string', example: 'contact' })
    public contact: string;
}

class CompanyDetailResponse {
    @ApiProperty({ type: 'string', example: 'Company Name' })
    public name: string;

    @ApiProperty({ type: 'string', example: '0000 street, 00-dong, 00-gu, 00:00' })
    public address: string;

    @ApiProperty({ type: 'string', example: 'File name' })
    public logoFileName: string;

    @ApiProperty({ type: 'string', example: 'File key' })
    public logoFileKey: string;

    @ApiProperty({ type: 'string', example: 'File type' })
    public logoFileType: string;

    @ApiProperty({ type: BigInt, example: 'File size' })
    public logoFileSize: bigint;

    @ApiProperty({ type: 'string', example: 'Name of The presentative' })
    public presentativeName: string;

    @ApiProperty({ type: 'string', example: 'email address' })
    public email: string;

    @ApiProperty({ type: 'string', example: 'Phone' })
    public contactPhone: string;
}

export class SiteMemberGetDetailResponse {
    @ApiProperty({
        type: SiteDetailResponse,
    })
    public site: SiteDetailResponse;

    @ApiProperty({
        type: CompanyDetailResponse,
    })
    public company: CompanyDetailResponse;
}
