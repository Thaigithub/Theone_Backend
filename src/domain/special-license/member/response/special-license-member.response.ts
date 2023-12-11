import { File, SpecialLicense } from '@prisma/client';
export class SpecialLicenseMemberGetResponse {
    id: SpecialLicense['id'];
    name: SpecialLicense['name'];
    status: SpecialLicense['status'];
    acquisitionDate: SpecialLicense['acquisitionDate'];
    licenseNumber: SpecialLicense['licenseNumber'];
    file: SpecialLicenseFileResponse;
}
export class SpecialLicenseFileResponse {
    type: File['type'];
    key: File['key'];
    fileName: File['fileName'];
    size: number;
}
