import { Controller, Get } from '@nestjs/common';
import { CodeType } from '@prisma/client';
import { BaseResponse } from 'utils/generics/base.response';
import { FilterService } from './filter.service';
import { CodeResponse } from './response/filter-get-code.response';

@Controller('filter')
export class FilterController {
    constructor(private readonly filterService: FilterService) {}

    @Get('general')
    async getGeneralList(): Promise<BaseResponse<CodeResponse[]>> {
        return BaseResponse.of(await this.filterService.getCodeList(CodeType.GENERAL));
    }

    @Get('special')
    async getSpecialList(): Promise<BaseResponse<CodeResponse[]>> {
        return BaseResponse.of(await this.filterService.getCodeList(CodeType.SPECIAL));
    }
}
