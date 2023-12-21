import { ApiProperty } from '@nestjs/swagger';

export class HeadhuntingAdminGetDetailRequestResponse {
    @ApiProperty({ example: 1 })
    public id: number;

    //Basic Ìnormation
    @ApiProperty({ example: 'Site name' })
    public siteName: string;

    @ApiProperty({ example: 'Dewon Kim' })
    public personInChargeName: string;

    @ApiProperty({ example: '000-0000-0000' })
    public siteContact: string;

    @ApiProperty({ example: 'theone@gmail.com' })
    public siteEmail: string;

    //Manpower Request
    @ApiProperty({ example: '_' })
    public occupation: string;

    @ApiProperty({ example: '_' })
    public specialNote: string;

    @ApiProperty({ example: 'Regardless of experience' })
    public career: string;

    @ApiProperty({ example: 'Team/Individual' })
    public employee: string;

    @ApiProperty({ example: 'Show customer-created titles' })
    public title: string;

    @ApiProperty({ example: 'Show what customers have written' })
    public detail: string;
}
