import { Career, Code } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class CareerResponse {
    id: Career['id'];
    type: Career['type'];
    companyName: Career['companyName'];
    siteName: Career['siteName'];
    startDate: Career['startDate'];
    endDate: Career['endDate'];
    occupation: Code;
    isExperienced: Career['isExperienced'];
}

export class CareerMemberGetListResponse extends PaginationResponse<CareerResponse> {}
