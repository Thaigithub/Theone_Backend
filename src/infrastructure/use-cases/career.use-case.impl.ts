import { Injectable } from '@nestjs/common';
import { CareerUseCase } from 'application/use-cases/career.use-case';
import { CareerRepository } from 'domain/repositories/career.repository';
import { MemberRepository } from 'domain/repositories/member.repository';
import { CreateCareerRequest, GetCareerListRequest } from 'presentation/requests/career.request';
import { GetCareerListResponse } from 'presentation/responses/career.response';

@Injectable()
export class CareerUseCaseImpl implements CareerUseCase {
  constructor(
    private readonly careerRepository: CareerRepository,
    private readonly memberRepository: MemberRepository,
  ) {}

  async getList(query: GetCareerListRequest, request: any): Promise<GetCareerListResponse> {
    const list = await this.careerRepository.findByQuery(query, request);
    const total = await this.careerRepository.countByQuery(query, request);
    return new GetCareerListResponse(list, total);
  }

  async createCareer(body: CreateCareerRequest, request: any): Promise<void> {
    const memberId = await this.memberRepository.findMemberId(request.user.accountId);
    await this.careerRepository.createOne(body, memberId);
  }

  async deleteCareer(careerId: number, request: any): Promise<void> {
    const memberId = await this.memberRepository.findMemberId(request.user.accountId);
    await this.careerRepository.deleteOne(careerId, memberId);
  }
}
