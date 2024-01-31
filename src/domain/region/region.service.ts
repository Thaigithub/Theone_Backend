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
                },
            })
        ).reduce((accum, current) => {
            if (accum.length === 0) {
                accum.push({
                    id: accum.length,
                    koreanName: current.cityKoreanName,
                    englishName: current.cityEnglishName,
                    district: [
                        {
                            id: current.id,
                            cityId: accum.length,
                            koreanName: current.districtKoreanName,
                            englishName: current.districtEnglishName,
                        },
                    ],
                });
            } else {
                const names = accum.map((item) => item.koreanName);
                if (names.includes(current.cityKoreanName)) {
                    accum = accum.map((item) => {
                        if (item.koreanName === current.cityKoreanName)
                            item.district.push({
                                id: current.id,
                                cityId: item.id,
                                koreanName: current.districtKoreanName,
                                englishName: current.districtEnglishName,
                            });
                        return item;
                    });
                } else {
                    accum.push({
                        id: accum.length,
                        koreanName: current.cityKoreanName,
                        englishName: current.cityEnglishName,
                        district: [
                            {
                                id: current.id,
                                cityId: accum.length,
                                koreanName: current.districtKoreanName,
                                englishName: current.districtEnglishName,
                            },
                        ],
                    });
                }
            }
            return accum;
        }, []);
        return cities;
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
