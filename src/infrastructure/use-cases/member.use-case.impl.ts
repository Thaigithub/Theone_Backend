import { Inject, Injectable } from '@nestjs/common';
import { MemberUseCase } from 'application/use-cases/member.use-case';
import { MemberRepository } from 'domain/repositories/member.repository';
import { ChangeMemberRequest, GetListRequest, UpsertBankAccountRequest } from 'presentation/requests/member.request';
import { GetListResponse, MemberDetailsResponse } from 'presentation/responses/member.response';
import { Response } from 'express';
import { ExcelService } from 'infrastructure/services/excel.service';

@Injectable()
export class MemberUseCaseImpl implements MemberUseCase {
  constructor(
    @Inject(MemberRepository) private memberRepository: MemberRepository,
    @Inject(ExcelService) private readonly excelService: ExcelService,
  ) {}

  async getList(query: GetListRequest): Promise<GetListResponse> {
    const members = await this.memberRepository.findByQuery(query);
    const total = await this.memberRepository.countByQuery(query);
    return new GetListResponse(members, total);
  }

  async getMemberDetails(id: number): Promise<MemberDetailsResponse> {
    return await this.memberRepository.findById(id);
  }

  async changeMemberInfo(payload: ChangeMemberRequest): Promise<void> {
    await this.memberRepository.updateMember(payload);
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
}
