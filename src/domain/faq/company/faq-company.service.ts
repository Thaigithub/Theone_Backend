import { Injectable } from '@nestjs/common';
import { FaqCategory, InquirerType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PageInfo, PaginationResponse } from '../../../utils/generics/pagination.response';
import { FaqCompanyGetListRequest } from './request/faq-company-get-list.request';
import { FaqCompanyGetListResponse } from './response/faq-company-get-list.response';

@Injectable()
export class FaqCompanyService {
    constructor(private prismaService: PrismaService) {}

    async getList(query: FaqCompanyGetListRequest): Promise<FaqCompanyGetListResponse> {
        const queryFilter: Prisma.FaqWhereInput = {
            isActive: true,
            inquirerType: InquirerType.COMPANY,
            ...(query.category && { category: FaqCategory[query.category] }),
        };

        const search = {
            include: {
                faqFiles: {
                    include: {
                        file: true,
                    },
                },
            },
            where: queryFilter,
            ...QueryPagingHelper.queryPaging(query),
            orderBy: {
                createdAt: Prisma.SortOrder.desc,
            },
        };
        const faqs = (await this.prismaService.faq.findMany(search)).map((item) => {
            return {
                id: item.id,
                createdAt: item.createdAt,
                question: item.question,
                answer: item.answer,
                writer: item.writer,
                category: item.category,

                files: item.faqFiles.map((fileItem) => {
                    return {
                        fileName: fileItem.file.fileName,
                        type: fileItem.file.type,
                        key: fileItem.file.key,
                        size: Number(fileItem.file.size),
                    };
                }),
            };
        });
        const total = await this.prismaService.faq.count({ where: search.where });

        return new PaginationResponse(faqs, new PageInfo(total));
    }
}
