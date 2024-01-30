import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CodeMemberGetListResponse } from './response/code-member-get-list.response';

@Injectable()
export class CodeMemberService {
    constructor(private readonly prismaService: PrismaService) {}

    async getList(): Promise<CodeMemberGetListResponse[]> {
        return await this.prismaService.code.findMany({
            select: {
                id: true,
                codeName: true,
            },
            where: {
                isActive: true,
            },
        });
    }
}
