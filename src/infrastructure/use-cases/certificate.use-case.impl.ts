import { Inject, Injectable } from '@nestjs/common';
import { CertificateUseCase } from 'application/use-cases/certificate.use-case';
import { CertificateRepository } from 'domain/repositories/certificate.repository';
import { MemberRepository } from 'domain/repositories/member.repository';
import { GetMemberCertificateRequest } from 'presentation/requests/member-certificate.request';
import { GetMemberCertificateResponse } from 'presentation/responses/member-certificate.response';
import { PaginationResponse } from 'presentation/responses/pageInfo.response';

@Injectable()
export class CertificateUseCaseImpl implements CertificateUseCase {
  constructor(
    @Inject(CertificateRepository) private readonly certificateRepository: CertificateRepository,
    @Inject(MemberRepository) private readonly memberRepository: MemberRepository,
  ) {}
  async getCertificateDetails(id: number): Promise<GetMemberCertificateResponse> {
    const result = await this.certificateRepository.findCertificateDetail(id);
    return result;
  }
  async getPaginatedCertificates(request: GetMemberCertificateRequest): Promise<PaginationResponse<GetMemberCertificateResponse>> {
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
