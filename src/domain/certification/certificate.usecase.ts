import {
    GetMemberCertificateRequest,
    UpSertMemberCertificateRequest,
} from 'domain/certification/request/member-certificate.request';
import { GetMemberCertificateResponse } from 'domain/certification/response/member-certificate.response';
import { PaginationResponse } from 'utils/generics/pageInfo.response';

export interface CertificateUseCase {
    getCertificateDetails(id: number): Promise<GetMemberCertificateResponse>;
    getPaginatedCertificates(request: GetMemberCertificateRequest): Promise<PaginationResponse<GetMemberCertificateResponse>>;
    saveCertificate(accountId: number, request: UpSertMemberCertificateRequest): Promise<void>;
    deleteCertificate(id: number): Promise<void>;
}
export const CertificateUseCase = Symbol('CertificateUseCase');
