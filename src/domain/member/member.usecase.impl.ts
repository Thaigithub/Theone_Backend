import { Injectable } from '@nestjs/common';
import { MemberRepository } from 'domain/member/member.repository';
import { MemberUseCase } from 'domain/member/member.usecase';
import {
    ChangeMemberRequest,
    GetMemberListRequest,
    UpsertBankAccountRequest,
    UpsertDisabilityRequest,
    UpsertForeignWorkerRequest,
    UpsertHSTCertificateRequest,
} from 'domain/member/request/member.request';
import { GetMemberListResponse, MemberDetailsResponse } from 'domain/member/response/member.response';
import { Response } from 'express';
import { ExcelService } from 'services/excel/excel.service';

@Injectable()
export class MemberUseCaseImpl implements MemberUseCase {
    constructor(
        private readonly memberRepository: MemberRepository,
        private readonly excelService: ExcelService,
    ) {}

    async getList(query: GetMemberListRequest): Promise<GetMemberListResponse> {
        const list = await this.memberRepository.findByQuery(query);
        const total = await this.memberRepository.countByQuery(query);
        return new GetMemberListResponse(list, total);
    }

    async getMemberDetails(id: number): Promise<MemberDetailsResponse> {
        return await this.memberRepository.findById(id);
    }

    async changeMemberInfo(id: number, payload: ChangeMemberRequest): Promise<void> {
        await this.memberRepository.updateMember(id, payload);
    }

    async download(memberIds: number[], response: Response): Promise<void> {
        const members = await this.memberRepository.findByIds(memberIds);
        const excelStream = await this.excelService.createExcelFile(members, 'Members');
        response.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        response.setHeader('Content-Disposition', 'attachment; filename=MemberList.xlsx');
        excelStream.pipe(response);
    }
    async upsertBankAccount(id: number, bankAccount: UpsertBankAccountRequest): Promise<void> {
        await this.memberRepository.upsertBankAccount(id, bankAccount);
    }
    async upsertHSTCertificate(id: number, hstCertificate: UpsertHSTCertificateRequest): Promise<void> {
        await this.memberRepository.upsertHSTCertificate(id, hstCertificate);
    }
    async upsertForeignWorker(id: number, foreignWorker: UpsertForeignWorkerRequest): Promise<void> {
        await this.memberRepository.upsertForeignWorker(id, foreignWorker);
    }
    async upsertDisability(id: number, disability: UpsertDisabilityRequest): Promise<void> {
        await this.memberRepository.upsertDisability(id, disability);
    }
}
