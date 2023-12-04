import { GetMemberCertificateRequest, UpSertMemberCertificateRequest } from 'presentation/requests/member-certificate.request';
import { GetMemberCertificateResponse } from 'presentation/responses/member-certificate.response';
import { PaginationResponse } from 'presentation/responses/pageInfo.response';

export interface CertificateUseCase {
  getCertificateDetails(id: number): Promise<GetMemberCertificateResponse>;
  getPaginatedCertificates(request: GetMemberCertificateRequest): Promise<PaginationResponse<GetMemberCertificateResponse>>;
  saveCertificate(accountId: number, request: UpSertMemberCertificateRequest): Promise<void>;
  deleteCertificate(id: number): Promise<void>;
}
export const CertificateUseCase = Symbol('CertificateUseCase');
