import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { Error } from 'utils/error.enum';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { MemoMemberUpsertRequest } from './request/memo-member-upsert.request';
import { MemoMemberGetDetailResponse } from './response/memo-member-get-detail.response';
import { MemoMemberGetListResponse } from './response/memo-member-get-list.response';

@Injectable()
export class MemoMemberService {
    constructor(private prismaService: PrismaService) {}

    async getList(accountId: number): Promise<MemoMemberGetListResponse> {
        const memos = await this.prismaService.memo.findMany({
            where: {
                member: {
                    accountId,
                },
                isActive: true,
            },
            select: {
                note: true,
                startDate: true,
                endDate: true,
                id: true,
            },
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
                isActive: true,
            },
        });
        if (!memo) throw new NotFoundException(Error.MEMO_NOT_FOUND);
        delete memo.id;
        delete memo.memberId;
        return memo;
    }

    async create(accountId: number, body: MemoMemberUpsertRequest): Promise<void> {
        if (new Date(body.startDate) > new Date(body.endDate)) throw new BadRequestException(Error.REQUEST_NOT_APPROPRIATE);
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
        if (new Date(body.startDate) > new Date(body.endDate)) throw new BadRequestException(Error.REQUEST_NOT_APPROPRIATE);
        const memo = await this.prismaService.memo.findUnique({
            where: {
                member: {
                    accountId,
                },
                id,
                isActive: true,
            },
        });
        if (!memo) throw new NotFoundException(Error.MEMO_NOT_FOUND);
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

    async delete(accountId: number, id: number): Promise<void> {
        const memo = await this.prismaService.memo.findUnique({
            where: {
                member: {
                    accountId,
                },
                id,
                isActive: true,
            },
        });
        if (!memo) throw new NotFoundException(Error.MEMO_NOT_FOUND);
        await this.prismaService.memo.update({
            where: {
                id,
            },
            data: {
                isActive: false,
            },
        });
    }
}
