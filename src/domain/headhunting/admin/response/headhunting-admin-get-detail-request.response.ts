import { ApiProperty } from '@nestjs/swagger';

export class HeadhuntingAdminGetDetailRequestResponse {
    @ApiProperty({ example: 1 })
    id: number;

    //Basic Ìnormation
    @ApiProperty({ example: 'Site name' })
    siteName: string;

    @ApiProperty({ example: 'Dewon Kim' })
    personInChargeName: string;

    @ApiProperty({ example: '000-0000-0000' })
    siteContact: string;

    @ApiProperty({ example: 'theone@gmail.com' })
    siteEmail: string;

    //Manpower Request
    @ApiProperty({ example: '_' })
    occupation: string;

    @ApiProperty({ example: '_' })
    specialNote: string;

    @ApiProperty({ example: 'Regardless of experience' })
    career: string;

    @ApiProperty({ example: 'Team/Individual' })
    employee: string;

    @ApiProperty({ example: 'Show customer-created titles' })
    title: string;

    @ApiProperty({ example: 'Show what customers have written' })
    detail: string;
}
