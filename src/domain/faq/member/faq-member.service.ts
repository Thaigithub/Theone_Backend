import { Injectable } from '@nestjs/common';
import { FaqCategory, InquirerType, Prisma } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PageInfo, PaginationResponse } from '../../../utils/generics/pagination.response';
import { FaqMemberGetListRequest } from './request/faq-member-get-list.request';
import { FaqMemberGetListResponse } from './response/faq-member-get-list.response';

@Injectable()
export class FaqMemberService {
    constructor(private prismaService: PrismaService) {}

    async getList(query: FaqMemberGetListRequest): Promise<FaqMemberGetListResponse> {
        const queryFilter: Prisma.FaqWhereInput = {
            isActive: true,
            inquirerType: InquirerType.MEMBER,
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
