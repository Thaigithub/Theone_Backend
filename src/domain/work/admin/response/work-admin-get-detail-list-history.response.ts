import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class WorkAdminGetDetailItemHistoryResponse {
    @ApiProperty()
    workerName: string;

    @ApiProperty()
    workDay: string[];
}
export class WorkAdminGetDetailListHistoryResponse extends PaginationResponse<WorkAdminGetDetailItemHistoryResponse> {}
