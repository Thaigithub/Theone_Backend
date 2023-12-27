import { ApiProperty } from '@nestjs/swagger';
import { PostApplicationStatus } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { FileClass } from '../dto/application-member-filetype.response.dto';
import { OfferType } from '../enum/application-member-get-list-offer-type.enum';
export class GetOfferResponse {
    @ApiProperty({ type: 'enum', enum: OfferType })
    type: OfferType;
    @ApiProperty({ type: String })
    teamName: string | null;
    @ApiProperty({ type: FileClass })
    companyLogo: FileClass;
    @ApiProperty({ type: String })
    siteName: string;
    @ApiProperty({ type: String })
    siteAddress: string;
    @ApiProperty({ type: String })
    postName: string;
    @ApiProperty({ type: String })
    requestDate: string;
    @ApiProperty({ type: String })
    occupationName: string;
    @ApiProperty({ type: 'enum', enum: PostApplicationStatus })
    applicationStatus: PostApplicationStatus;
}
export class ApplicationMemberGetListOfferResponse extends PaginationResponse<GetOfferResponse> {}
