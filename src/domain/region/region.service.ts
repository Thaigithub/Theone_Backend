import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { RegionGetListResponse } from './response/region-get-list.response';

@Injectable()
export class RegionService {
    constructor(private prismaService: PrismaService) {}

    async getList(): Promise<RegionGetListResponse[]> {
        const cities = (
            await this.prismaService.region.findMany({
                where: {
                    isActive: true,
                },
                select: {
                    id: true,
                    districtKoreanName: true,
                    districtEnglishName: true,
                    cityKoreanName: true,
                    cityEnglishName: true,
                    cityId: true,
                },
                orderBy: {
                    cityId: 'asc',
                },
            })
        )
            .reduce((result: RegionGetListResponse[], current) => {
                if (result.some((item) => item.id === current.cityId)) {
                    const elementToUpdate = result.find((element) => element.id === current.cityId);
                    if (elementToUpdate) {
                        elementToUpdate.district.push({
                            id: current.id,
                            englishName: current.districtEnglishName,
                            koreanName: current.districtKoreanName,
                            cityId: current.cityId,
                        });
                    }
                } else {
                    result.push({
                        id: current.cityId,
                        englishName: current.cityEnglishName,
                        koreanName: current.cityKoreanName,
                        district: [
                            {
                                id: current.id,
                                englishName: current.districtEnglishName,
                                koreanName: current.districtKoreanName,
                                cityId: current.cityId,
                            },
                        ],
                    } as RegionGetListResponse);
                }
                return result;
            }, [])
            .map((item) => {
                item.district = item.district.sort((a, b) => {
                    if (b.englishName === 'All') {
                        return 1;
                    } else if (a.englishName === 'All') {
                        return -1;
                    }
                    return 0;
                });
                return item;
            });
        return cities;
    }

    async parseFromRegionList(regionList: string[]): Promise<{ ids: number[] }> {
        const list = regionList
            ? regionList.map((item) => {
                  const cityId = parseInt(item.split('-')[0]);
                  const districtId = parseInt(item.split('-')[1]);
                  return [cityId, districtId];
              })
            : [];

        const districtEntireCitiesList = [];

        await Promise.all(
            list.map(async (item) => {
                const region = await this.prismaService.region.findUnique({
                    where: {
                        id: item[1],
                    },
                    select: {
                        districtEnglishName: true,
                    },
                });

                if (region.districtEnglishName === 'All') {
                    const regionIds = await this.prismaService.region.findMany({
                        where: {
                            cityId: item[0],
                        },
                        select: {
                            id: true,
                        },
                    });

                    districtEntireCitiesList.push(...regionIds.map((item) => item.id));
                } else districtEntireCitiesList.push(item[1]);
            }),
        );

        return { ids: districtEntireCitiesList };
    }
}
