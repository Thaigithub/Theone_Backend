import { Code, SpecialLicense } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class SpecialLicenseMemberGetDetailResponse {
    id: SpecialLicense['id'];
    codeName: Code['codeName'];
    status: SpecialLicense['status'];
    acquisitionDate: SpecialLicense['acquisitionDate'];
    licenseNumber: SpecialLicense['licenseNumber'];
    file: FileResponse;
}
