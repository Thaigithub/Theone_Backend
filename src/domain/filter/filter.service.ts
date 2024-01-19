import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { FilterGetCodeResponse } from './response/filter-get-code.response';
import { CodeType } from '@prisma/client';
import { FilterGetBankResponse } from './response/filter-get-bank.response';

@Injectable()
export class FilterService {
    constructor(private readonly prismaService: PrismaService) {}

    async getCodeList(typeOfCode: CodeType): Promise<FilterGetCodeResponse[]> {
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

    async getBankList(): Promise<FilterGetBankResponse[]> {
        return await this.prismaService.bank.findMany({
            select: {
                name: true,
            },
            where: {
                isActive: true,
            },
        });
    }
}
