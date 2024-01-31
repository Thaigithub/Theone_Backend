import { Controller, Get, Query } from '@nestjs/common';
import { BaseResponse } from 'utils/generics/base.response';
import { CodeAdminGetListRequest } from '../admin/request/code-admin-get-list.request';
import { CodeAdminGetListResponse } from '../admin/response/code-admin-get-list.response';
import { CodeMemberService } from '../member/code-member.service';

@Controller('/guest/codes')
export class CodeGuestController {
    constructor(private codeMemberService: CodeMemberService) {}

    @Get()
    async getList(@Query() query: CodeAdminGetListRequest): Promise<BaseResponse<CodeAdminGetListResponse>> {
        return BaseResponse.of(await this.codeMemberService.getList(query));
    }
}
