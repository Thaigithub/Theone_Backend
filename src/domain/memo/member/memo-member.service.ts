import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { MemoMemberGetListRequest } from './request/memo-member-get-list.request';
import { MemoMemberUpsertRequest } from './request/memo-member-upsert.request';
import { MemoMemberGetDetailResponse } from './response/memo-member-get-detail.response';
import { MemoMemberGetListResponse } from './response/memo-member-get-list.response';

@Injectable()
export class MemoMemberService {
    constructor(private prismaService: PrismaService) {}

    async getList(accountId: number, query: MemoMemberGetListRequest): Promise<MemoMemberGetListResponse> {
        const startDate = new Date(query.month.concat('-01'));
        const endDate = new Date(startDate);
        startDate.setDate(startDate.getDate() - 7);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(endDate.getDate() + 7);
        const queryInput: Prisma.MemoWhereInput = {
            member: {
                accountId,
            },
            NOT: {
                OR: [
                    {
                        startDate: {
                            gte: endDate,
                        },
                    },
                    {
                        endDate: {
                            lt: startDate,
                        },
                    },
                ],
            },
        };
        const memos = await this.prismaService.memo.findMany({
            where: queryInput,
        });
        return new PaginationResponse(memos, new PageInfo(memos.length));
    }

    async getDetail(accountId: number, id: number): Promise<MemoMemberGetDetailResponse> {
        const memo = await this.prismaService.memo.findUnique({
            where: {
                member: {
                    accountId,
                },
                id,
            },
        });
        if (!memo) throw new NotFoundException('Memo not found');
        delete memo.id;
        delete memo.memberId;
        return memo;
    }

    async create(accountId: number, body: MemoMemberUpsertRequest): Promise<void> {
        if (new Date(body.startDate) > new Date(body.endDate))
            throw new BadRequestException('startDate must be earlier than endDate');
        await this.prismaService.memo.create({
            data: {
                member: {
                    connect: {
                        accountId,
                    },
                },
                startDate: new Date(body.startDate),
                endDate: new Date(body.endDate),
                note: body.note,
            },
        });
    }

    async update(accountId: number, id: number, body: MemoMemberUpsertRequest): Promise<void> {
        if (new Date(body.startDate) > new Date(body.endDate))
            throw new BadRequestException('startDate must be earlier than endDate');
        const memo = await this.prismaService.memo.findUnique({
            where: {
                member: {
                    accountId,
                },
                id,
            },
        });
        if (!memo) throw new NotFoundException('Memo not found');
        await this.prismaService.memo.update({
            where: {
                id,
            },
            data: {
                startDate: new Date(body.startDate),
                endDate: new Date(body.endDate),
                note: body.note,
            },
        });
    }
}
