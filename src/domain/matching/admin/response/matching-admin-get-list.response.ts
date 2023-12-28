import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class MatchingAdminGetItemResponse {
    @ApiProperty()
    companyName: string;

    @ApiProperty()
    siteName: string;

    @ApiProperty()
    postName: string;

    @ApiProperty()
    numberOfInterviewRequests: number;

    @ApiProperty()
    numberOfInterviewRejections: number;

    @ApiProperty()
    paymentDate: Date;

    @ApiProperty()
    startDate: Date;

    @ApiProperty()
    endDate: Date;

    @ApiProperty()
    remainingNumber: string;
}

export class MatchingAdminGetListResponse extends PaginationResponse<MatchingAdminGetItemResponse> {}
