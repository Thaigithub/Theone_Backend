import { Code, License } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';

export class LicenseMemberGetDetailResponse {
    id: License['id'];
    codeName: Code['name'];
    codeId: Code['id'];
    status: License['status'];
    acquisitionDate: License['acquisitionDate'];
    licenseNumber: License['licenseNumber'];
    file: FileResponse;
}
