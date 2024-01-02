import { ApiProperty } from '@nestjs/swagger';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class MatchingMemberGetItemResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    postName: string;

    @ApiProperty()
    sitename: string;

    @ApiProperty()
    location: string;

    @ApiProperty()
    deadline: string;

    @ApiProperty()
    occupation: string;

    @ApiProperty()
    logo: FileResponse;

    @ApiProperty()
    isInterested: boolean;

    @ApiProperty()
    isRefuse: boolean;

    @ApiProperty()
    isApplication: boolean;
}
export class MatchingMemberGetListResponse extends PaginationResponse<MatchingMemberGetItemResponse> {}
