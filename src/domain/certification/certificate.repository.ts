import { Injectable } from '@nestjs/common';
import { Certificate } from '@prisma/client';
import {
    GetMemberCertificateRequest,
    UpSertMemberCertificateRequest,
} from 'domain/certification/request/member-certificate.request';
import { GetMemberCertificateResponse } from 'domain/certification/response/member-certificate.response';
import { BaseRepository } from '../../helpers/entity/base.repository';
@Injectable()
export abstract class CertificateRepository extends BaseRepository<Certificate> {
    abstract findCertificatesWithAccountId(
        request: GetMemberCertificateRequest,
        hasOrder?: boolean,
    ): Promise<GetMemberCertificateResponse[]>;
    abstract count(condition: any): Promise<number>;
    abstract findCertificateDetail(id: number): Promise<GetMemberCertificateResponse>;
    abstract createCertificate(memberId: number, upsertRequest: UpSertMemberCertificateRequest): Promise<void>;
    abstract delelteCertificate(id: number): Promise<void>;
}
