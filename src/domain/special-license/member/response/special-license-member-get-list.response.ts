import { Code, SpecialLicense } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';
class GetListResponse {
    id: SpecialLicense['id'];
    codeName: Code['codeName'];
    status: SpecialLicense['status'];
    acquisitionDate: SpecialLicense['acquisitionDate'];
    licenseNumber: SpecialLicense['licenseNumber'];
    file: FileResponse;
}
export class SpecialLicenseMemberGetListResponse extends PaginationResponse<GetListResponse> {}
