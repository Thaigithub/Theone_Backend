import { Controller, Get } from '@nestjs/common';
import { BaseResponse } from 'utils/generics/base.response';
import { CodeMemberService } from '../member/code-member.service';
import { CodeMemberGetListResponse } from '../member/response/code-member-get-list.response';

@Controller('/guest/codes')
export class CodeGuestController {
    constructor(private codeMemberService: CodeMemberService) {}

    @Get()
    async getList(): Promise<BaseResponse<CodeMemberGetListResponse[]>> {
        return BaseResponse.of(await this.codeMemberService.getList());
    }
}
