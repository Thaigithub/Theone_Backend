import { Career, Code } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

class CareerResponse {
    id: Career['id'];
    type: Career['type'];
    companyName: Career['companyName'];
    siteName: Career['siteName'];
    startDate: Career['startDate'];
    endDate: Career['endDate'];
    occupationName: Code['name'];
}

export class CareerMemberGetListGeneralResponse extends PaginationResponse<CareerResponse> {}
