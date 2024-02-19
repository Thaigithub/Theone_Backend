import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { DeviceTokenRequest } from 'utils/generics/device-token.request';
import { DeviceMemberService } from './device-member.service';

@Controller('/member/devices')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class DeviceMemberController {
    constructor(private deviceMemberSevice: DeviceMemberService) {}

    @Post()
    async create(@Req() req: BaseRequest, @Body() body: DeviceTokenRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.deviceMemberSevice.create(req.user.accountId, body));
    }
}
