import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CodeMemberGetListResponse } from './response/code-member-get-list.response';

@Injectable()
export class CodeMemberService {
    constructor(private prismaService: PrismaService) {}

    async getList(): Promise<CodeMemberGetListResponse[]> {
        const queryFilter = {
            isActive: true,
        };

        const codeList = (
            await this.prismaService.code.findMany({
                select: {
                    id: true,
                    name: true,
                },
                where: queryFilter,
                orderBy: {
                    createdAt: 'desc',
                },
            })
        ).map((ỉtem) => {
            return {
                codeName: ỉtem.name,
                id: ỉtem.id,
            };
        });

        return codeList;
    }
}
