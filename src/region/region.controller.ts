import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { RegionService } from './region.service';
import { RegionGetListResponse } from './response/region-get-list.response';

@Controller('/regions')
@UseGuards(AuthJwtGuard)
export class RegionController {
    constructor(private regionService: RegionService) {}

    @Get('city')
    async getListCity(): Promise<BaseResponse<RegionGetListResponse>> {
        return BaseResponse.of(await this.regionService.getListCity());
    }
}
