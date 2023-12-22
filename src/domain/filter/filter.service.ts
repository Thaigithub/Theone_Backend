import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { CodeResponse } from './response/filter-get-code.response';
import { CodeType } from '@prisma/client';

@Injectable()
export class FilterService {
    constructor(private readonly prismaService: PrismaService) {}

    async getCodeList(typeOfCode: CodeType): Promise<CodeResponse[]> {
        return await this.prismaService.code.findMany({
            select: {
                id: true,
                codeName: true,
            },
            where: {
                isActive: true,
                codeType: typeOfCode,
            },
        });
    }
}
