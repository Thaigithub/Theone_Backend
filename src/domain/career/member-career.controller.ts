import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { CareerUseCase } from 'domain/career/career.usecase';
import { CreateCareerRequest, GetCareerListRequest } from 'domain/career/request/career.request';
import { GetCareerListResponse } from 'domain/career/response/career.response';
import { BaseResponse } from 'utils/generics/base.response';

@UseGuards(AuthJwtGuard)
@Controller('member/careers')
@ApiTags('[MEMBER] Career information')
export class MemberCareerController {
    constructor(@Inject(CareerUseCase) private readonly careerUseCase: CareerUseCase) {}

    // Get list of careers
    @Get()
    @ApiOperation({
        summary: 'Get list of careers of a member',
        description: 'Members can retrieve all of their careers',
    })
    async getList(@Query() query: GetCareerListRequest, @Req() request: any): Promise<BaseResponse<GetCareerListResponse>> {
        console.log(query);
        const careers = await this.careerUseCase.getList(query, request);
        return BaseResponse.of(careers);
    }

    // Create new career
    @Post()
    @ApiOperation({
        summary: 'Create career',
        description: 'Members can register a new GENERAL career',
    })
    async createCareer(@Body() body: CreateCareerRequest, @Req() request: any): Promise<BaseResponse<null>> {
        body.startDate = `${body.startDate}T00:00:00Z`;
        body.endDate = `${body.endDate}T00:00:00Z`;
        console.log(body);
        await this.careerUseCase.createCareer(body, request);
        return BaseResponse.ok();
    }

    // Delete a career
    @Delete(':id')
    @ApiOperation({
        summary: 'Delete career',
        description: 'Members can delete a registered career',
    })
    async deleteCareer(@Param('id', ParseIntPipe) id: number, @Req() request: any): Promise<BaseResponse<null>> {
        await this.careerUseCase.deleteCareer(id, request);
        return BaseResponse.ok();
    }
}
