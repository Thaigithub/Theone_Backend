import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'utils/generics/base.response';
import { AuthCompanyService } from './auth-company.service';
import { AuthCompanyLoginRequest } from './request/auth-company-login-normal.request';
import { AuthCompanyLoginSocialRequest } from './request/auth-company-login-social.request';
import { AuthCompanyLoginResponse } from './response/auth-company-login.response';
@ApiTags('[COMPANY] Authenticate')
@Controller('/company/auth')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AuthCompanyController {
    constructor(private readonly memberService: AuthCompanyService) {}
    // GOOGLE
    @Post('login/google')
    @ApiOperation({
        summary: 'Google Account Login',
        description: 'This endpoint login with Google acount',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Google Account logged in successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async googlelogin(@Body() authUserDto: AuthCompanyLoginSocialRequest): Promise<BaseResponse<AuthCompanyLoginResponse>> {
        return BaseResponse.of(await this.memberService.googleLogin(authUserDto));
    }
    // APPLE
    @Post('login/apple')
    @ApiOperation({
        summary: 'Apple Account Login',
        description: 'This endpoint login with Apple acount',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Apple Account logged in successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async applelogin(@Body() authUserDto: AuthCompanyLoginSocialRequest): Promise<BaseResponse<AuthCompanyLoginResponse>> {
        return BaseResponse.of(await this.memberService.appleLogin(authUserDto));
    }
    // KAKAO
    @Post('login/kakao')
    @ApiOperation({
        summary: 'Kakao Account Login',
        description: 'This endpoint login with Kakao acount',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Kakao Account logged in successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async kakaologin(@Body() authUserDto: AuthCompanyLoginSocialRequest): Promise<BaseResponse<AuthCompanyLoginResponse>> {
        return BaseResponse.of(await this.memberService.kakaoLogin(authUserDto));
    }
    // NAVER
    @Post('login/naver')
    @ApiOperation({
        summary: 'Naver Account Login',
        description: 'This endpoint login with Naver acount',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Naver Account logged in successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async naverlogin(@Body() authUserDto: AuthCompanyLoginSocialRequest): Promise<BaseResponse<AuthCompanyLoginResponse>> {
        return BaseResponse.of(await this.memberService.kakaoLogin(authUserDto));
    }
    // Normal
    @Post('login')
    @ApiOperation({
        summary: 'Login',
        description: 'This endpoint to login normally.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'User logged in successfully' })
    @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
    async login(@Body() authUserDto: AuthCompanyLoginRequest): Promise<BaseResponse<AuthCompanyLoginResponse>> {
        // console.log(await hash(authUserDto.password, 10));
        return BaseResponse.of(await this.memberService.login(authUserDto));
    }
}
