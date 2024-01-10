import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { RegionGetListResponse } from './response/region-get-list.response';

@Injectable()
export class RegionService {
    constructor(private prismaService: PrismaService) {}

    async getListCity(): Promise<RegionGetListResponse> {
        return await this.prismaService.city.findMany({
            include: {
                district: true,
            },
        });
    }

    async parseFromRegionList(regionList: string[]): Promise<{ districtsList: number[]; citiesList: number[] }> {
        let districtsList = regionList
            ? regionList.map((item) => {
                  return parseInt(item.split('-')[1]);
              })
            : [];
        const districtEntireCitiesList = await this.prismaService.district.findMany({
            where: {
                id: { in: districtsList },
                englishName: 'All',
            },
        });
        const districtEntireCitiesIdList = districtEntireCitiesList.map((item) => {
            return item.id;
        });
        districtsList = districtsList.filter((item) => {
            return !districtEntireCitiesIdList.includes(item);
        });
        const citiesList = districtEntireCitiesList.map((item) => {
            return item.cityId;
        });
        return { districtsList, citiesList };
    }
}
