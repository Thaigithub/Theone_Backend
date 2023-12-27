import { ApiProperty } from '@nestjs/swagger';
import { ExperienceType } from '@prisma/client';

export class MatchingMemberGetDetailResponse {
    @ApiProperty()
    postId: number;

    @ApiProperty()
    isInterested: boolean;

    @ApiProperty()
    postName: string;

    @ApiProperty()
    startDate: string;

    @ApiProperty()
    endDate: string;

    @ApiProperty()
    numberOfRecruited: number;

    @ApiProperty()
    personInChargeName: string;

    @ApiProperty()
    personInChargeContact: string;

    @ApiProperty()
    career: ExperienceType;

    @ApiProperty()
    occupation: string;

    // ??
    @ApiProperty()
    preferentialTreatment: string;

    @ApiProperty()
    detail: string;

    //on-site Information
    @ApiProperty()
    siteName: string;

    @ApiProperty()
    siteAddress: string;

    @ApiProperty()
    siteStartDate: string;

    @ApiProperty()
    siteEndDate: string;

    // ??
    @ApiProperty()
    originalContractor: string;

    @ApiProperty()
    originalBuilding: string;

    @ApiProperty()
    workLocation: string;
}
