import { Certificate, File } from '@prisma/client';
export class GetMemberCertificateResponse {
    id: Certificate['id'];
    name: Certificate['name'];
    status: Certificate['status'];
    acquisitionDate: Certificate['acquisitionDate'];
    certificateNumber: Certificate['certificateNumber'];
    file: CertificateFileResponse;
    isSpecial: boolean;
}
export class CertificateFileResponse {
    type: File['type'];
    key: File['key'];
    fileName: File['fileName'];
    size: number;
}
