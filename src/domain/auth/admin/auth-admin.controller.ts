import { Body, Controller, Post } from '@nestjs/common';
import { BaseResponse } from 'utils/generics/base.response';
import { AdminAuthService } from './auth-admin.service';
import { AuthAdminLoginRequest } from './request/auth-admin-login-normal.request';
import { AuthAdminLoginResponse } from './response/auth-admin-login.response';

@Controller('/admin/auth')
export class AdminAuthController {
    constructor(private adminAuthService: AdminAuthService) {}

    @Post('/login')
    async login(@Body() authUserDto: AuthAdminLoginRequest): Promise<BaseResponse<AuthAdminLoginResponse>> {
        return BaseResponse.of(await this.adminAuthService.login(authUserDto));
    }
}
