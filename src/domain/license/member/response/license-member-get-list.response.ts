import { Code, License } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';
class GetListResponse {
    id: License['id'];
    codeName: Code['name'];
    status: License['status'];
    acquisitionDate: License['acquisitionDate'];
    licenseNumber: License['licenseNumber'];
    file: FileResponse;
}
export class LicenseMemberGetListResponse extends PaginationResponse<GetListResponse> {}
