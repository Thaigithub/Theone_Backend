import { Body, Controller, Get, HttpStatus, Inject, Param, ParseIntPipe, Patch, Query, Res } from '@nestjs/common';
import { MemberUseCase } from 'application/use-cases/member.use-case';
import { ChangeMemberRequest, GetMemberListRequest, MemberDownloadRequest } from 'presentation/requests/member.request';
import { BaseResponse } from 'presentation/responses/base.response';
import { GetMemberListResponse, MemberDetailsResponse } from 'presentation/responses/member.response';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('[ADMIN] Member Management')
@Controller('admin/members')
export class AdminMemberController {
  constructor(@Inject(MemberUseCase) private readonly memberUseCase: MemberUseCase) {}

  // Get members list by conditions
  @Get()
  @ApiOperation({
    summary: 'Listing members',
    description: 'Admin can search members by id, name, or can filter by membership level, account status',
  })
  @ApiResponse({
    type: GetMemberListResponse,
  })
  async getList(@Query() query: GetMemberListRequest): Promise<BaseResponse<GetMemberListResponse>> {
    const members = await this.memberUseCase.getList(query);
    return BaseResponse.of(members);
  }

  // Get member detail
  @Get(':id')
  @ApiOperation({
    summary: 'Get member detail',
    description: 'Retrieve member information detail',
  })
  @ApiResponse({
    type: GetMemberListResponse,
  })
  async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<MemberDetailsResponse>> {
    return BaseResponse.of(await this.memberUseCase.getMemberDetails(id));
  }

  // Change member information
  @Patch(':id')
  @ApiOperation({
    summary: 'Change member information',
    description: 'Admin can change account_status of member or membership_level',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async changeMemberInfo(@Param('id', ParseIntPipe) id: number, @Query() payload: ChangeMemberRequest): Promise<BaseResponse<null>> {
    await this.memberUseCase.changeMemberInfo(id, payload);
    return BaseResponse.ok();
  }

  // Download member list in excel file
  @Get('download')
  @ApiOperation({
    summary: 'Download member in excel file',
    description: 'Admin can retrieve an excel file contains information of selected members',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  async download(@Body() request: MemberDownloadRequest, @Res() response: Response): Promise<BaseResponse<null>> {
    await this.memberUseCase.download(request.memberIds, response);
    return BaseResponse.ok();
  }
}
