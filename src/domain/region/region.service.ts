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
}
