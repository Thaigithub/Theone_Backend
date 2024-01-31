import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { RegionGetListResponse } from './response/region-get-list.response';
import { QueryPagingHelper } from 'utils/pagination-query';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { PaginationRequest } from 'utils/generics/pagination.request';

@Injectable()
export class RegionService {
    constructor(private prismaService: PrismaService) {}

    async getList(query: PaginationRequest): Promise<RegionGetListResponse> {
        const regions = await this.prismaService.region.findMany({
            where: {
                isActive: true,
            },
            select: {
                id: true,
                districtKoreanName: true,
                districtEnglishName: true,
                cityKoreanName: true,
                cityEnglishName: true,
            },
            ...QueryPagingHelper.queryPaging(query),
        });
        const count = await this.prismaService.region.count({
            where: {
                isActive: true,
            },
        });
        return new PaginationResponse(regions, new PageInfo(count));
    }

    async parseFromRegionList(regionList: string[]): Promise<{ ids: number[] }> {
        const list = regionList
            ? regionList.map((item) => {
                  return parseInt(item.split('-')[1]);
              })
            : [];
        const districtEntireCitiesList = (
            await this.prismaService.region.findMany({
                where: {
                    id: { in: list },
                    isActive: true,
                },
                select: {
                    id: true,
                },
            })
        ).map((item) => {
            return item.id;
        });
        return { ids: districtEntireCitiesList };
    }
}
