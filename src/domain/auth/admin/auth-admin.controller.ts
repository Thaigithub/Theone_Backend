import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'utils/generics/base.response';
import { AdminAuthService } from './auth-admin.service';
import { AuthAdminLoginRequest } from './request/auth-admin-login-normal.request';
import { AuthAdminLoginResponse } from './response/auth-admin-login.response';
@ApiTags('[ADMIN] Authenticate')
@Controller('/admin/auth')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AdminAuthController {
    constructor(private readonly adminAuthService: AdminAuthService) {}
    // Normal
    @Post('login')
    @ApiOperation({
        summary: 'Login',
        description: 'This endpoint to login normally.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'User logged in successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async login(@Body() authUserDto: AuthAdminLoginRequest): Promise<BaseResponse<AuthAdminLoginResponse>> {
        // console.log(await hash(authUserDto.password, 10));
        return BaseResponse.of(await this.adminAuthService.login(authUserDto));
    }
}
