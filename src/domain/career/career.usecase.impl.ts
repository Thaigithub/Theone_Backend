import { Injectable } from '@nestjs/common';
import { CareerRepository } from 'domain/career/career.repository';
import { CareerUseCase } from 'domain/career/career.usecase';
import { CreateCareerRequest, GetCareerListRequest } from 'domain/career/request/career.request';
import { GetCareerListResponse } from 'domain/career/response/career.response';
import { MemberRepository } from 'domain/member/member.repository';

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
