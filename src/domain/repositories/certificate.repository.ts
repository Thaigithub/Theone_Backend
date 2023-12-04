import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { GetMemberCertificateRequest, UpSertMemberCertificateRequest } from 'presentation/requests/member-certificate.request';
import { Certificate } from '@prisma/client';
import { GetMemberCertificateResponse } from 'presentation/responses/member-certificate.response';
@Injectable()
export abstract class CertificateRepository extends BaseRepository<Certificate> {
  abstract findCertificatesWithAccountId(request: GetMemberCertificateRequest, hasOrder?: boolean): Promise<GetMemberCertificateResponse[]>;
  abstract count(condition: any): Promise<number>;
  abstract findCertificateDetail(id: number): Promise<GetMemberCertificateResponse>;
  abstract createCertificate(memberId: number, upsertRequest: UpSertMemberCertificateRequest): Promise<void>;
  abstract delelteCertificate(id: number): Promise<void>;
}
