import { Contract, Member, RequestObject } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class GetListForSite {
    type: RequestObject;
    id: number;
    applicantId: number;
    name: string;
    teamLeaderName: Member['name'];
    contact: Member['contact'];
    startDate: Contract['startDate'];
    endDate: Contract['endDate'];
    file: FileResponse;
}
export class ContractCompanyGetListForSiteResponse extends PaginationResponse<GetListForSite> {}
