import { Controller, Get } from '@nestjs/common';
import { CodeType } from '@prisma/client';
import { BaseResponse } from 'utils/generics/base.response';
import { FilterService } from './filter.service';
import { FilterGetCodeResponse } from './response/filter-get-code.response';
import { FilterGetBankResponse } from './response/filter-get-bank.response';

@Controller('filter')
export class FilterController {
    constructor(private readonly filterService: FilterService) {}

    @Get('general')
    async getGeneralList(): Promise<BaseResponse<FilterGetCodeResponse[]>> {
        return BaseResponse.of(await this.filterService.getCodeList(CodeType.GENERAL));
    }

    @Get('special')
    async getSpecialList(): Promise<BaseResponse<FilterGetCodeResponse[]>> {
        return BaseResponse.of(await this.filterService.getCodeList(CodeType.SPECIAL));
    }

    @Get('bank')
    async getBankList(): Promise<BaseResponse<FilterGetBankResponse[]>> {
        return BaseResponse.of(await this.filterService.getBankList());
    }
}
