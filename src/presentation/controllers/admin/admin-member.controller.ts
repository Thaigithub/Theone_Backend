import { Body, Controller, Get, HttpStatus, Inject, Param, ParseIntPipe, Patch, Query, Res } from '@nestjs/common';
import { MemberUseCase } from 'application/use-cases/member.use-case';
import { ChangeMemberRequest, GetListRequest, MemberDownloadRequest } from 'presentation/requests/member.request';
import { BaseResponse } from 'presentation/responses/base.response';
import { GetListResponse, MemberDetailsResponse } from 'presentation/responses/member.response';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('[ADMIN] Member Management')
@Controller('admin/members')
export class AdminMemberController {
  constructor(@Inject(MemberUseCase) private readonly memberUseCase: MemberUseCase) {}

  // Get members list by conditions
  @ApiOperation({
    summary: 'Listing members',
    description: 'Admin can search members by id, name, or can filter by membership level, account status',
  })
  @ApiResponse({
    type: GetListResponse,
  })
  @Get()
  async getList(@Query() query: GetListRequest): Promise<BaseResponse<GetListResponse>> {
    return BaseResponse.of(await this.memberUseCase.getList(query));
  }

  // Get member detail
  @ApiOperation({
    summary: 'Get member detail',
    description: 'Retrieve member information detail',
  })
  @ApiResponse({
    type: GetListResponse,
  })
  @Get('/:id')
  async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<MemberDetailsResponse>> {
    return BaseResponse.of(await this.memberUseCase.getMemberDetails(id));
  }

  // Change member information
  @ApiOperation({
    summary: 'Change member information',
    description: 'Admin can change account_status of member or membership_level',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Patch()
  async changeMemberInfo(@Query() payload: ChangeMemberRequest): Promise<BaseResponse<null>> {
    await this.memberUseCase.changeMemberInfo(payload);
    return BaseResponse.ok();
  }

  // Download member list in excel file
  @ApiOperation({
    summary: 'Download member in excel file',
    description: 'Admin can retrieve an excel file contains information of selected members',
  })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Get('download')
  async download(@Body() request: MemberDownloadRequest, @Res() response: Response): Promise<BaseResponse<null>> {
    await this.memberUseCase.download(request.memberIds, response);
    return BaseResponse.ok();
  }
}
