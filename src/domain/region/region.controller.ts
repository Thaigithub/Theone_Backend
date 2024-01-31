import { Controller, Get } from '@nestjs/common';
import { BaseResponse } from 'utils/generics/base.response';
import { RegionService } from './region.service';
import { RegionGetListResponse } from './response/region-get-list.response';

@Controller('regions')
export class RegionController {
    constructor(private regionService: RegionService) {}

    @Get()
    async getList(): Promise<BaseResponse<RegionGetListResponse[]>> {
        return BaseResponse.of(await this.regionService.getList());
    }
}
