import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CertificateRepository } from 'domain/certification/certificate.repository';
import { CertificateUseCase } from 'domain/certification/certificate.usecase';
import {
    GetMemberCertificateRequest,
    UpSertMemberCertificateRequest,
} from 'domain/certification/request/member-certificate.request';
import { GetMemberCertificateResponse } from 'domain/certification/response/member-certificate.response';
import { MemberRepository } from 'domain/member/member.repository';
import { PaginationResponse } from 'utils/generics/pageInfo.response';

@Injectable()
export class CertificateUseCaseImpl implements CertificateUseCase {
    constructor(
        @Inject(CertificateRepository) private readonly certificateRepository: CertificateRepository,
        @Inject(MemberRepository) private readonly memberRepository: MemberRepository,
    ) {}
    async deleteCertificate(id: number): Promise<void> {
        await this.certificateRepository.delelteCertificate(id);
    }
    async saveCertificate(accountId: number, request: UpSertMemberCertificateRequest): Promise<void> {
        const memberId = await this.memberRepository.findIdByAccountId(accountId);
        if (!memberId) {
            throw new NotFoundException('Member not found');
        }
        await this.certificateRepository.createCertificate(memberId, request);
    }
    async getCertificateDetails(id: number): Promise<GetMemberCertificateResponse> {
        const result = await this.certificateRepository.findCertificateDetail(id);
        return result;
    }
    async getPaginatedCertificates(
        request: GetMemberCertificateRequest,
    ): Promise<PaginationResponse<GetMemberCertificateResponse>> {
        const memberId = await this.memberRepository.findIdByAccountId(request.memberId);
        const updatedRequest: GetMemberCertificateRequest = {
            ...request,
            memberId: memberId,
        };
        const result = await this.certificateRepository.findCertificatesWithAccountId(updatedRequest);
        const countCondition: any = {
            where: {
                memberId: memberId,
            },
        };
        const total = await this.certificateRepository.count(countCondition);
        return {
            data: result,
            pageInfo: {
                total: total,
            },
        };
    }
}
