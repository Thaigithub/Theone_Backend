import { Controller, Get, Query } from '@nestjs/common';
import { BaseResponse } from 'utils/generics/base.response';
import { RegionService } from './region.service';
import { RegionGetListResponse } from './response/region-get-list.response';
import { PaginationRequest } from 'utils/generics/pagination.request';

@Controller('regions')
export class RegionController {
    constructor(private regionService: RegionService) {}

    @Get()
    async getList(@Query() query: PaginationRequest): Promise<BaseResponse<RegionGetListResponse>> {
        return BaseResponse.of(await this.regionService.getList(query));
    }
}
