import { Controller, Get, Inject, Query } from '@nestjs/common';
import { MemberUseCase } from 'application/use-cases/member.use-case';
import { GetListRequest } from 'presentation/requests/member.request';
import { BaseResponse } from 'presentation/responses/base.response';
import { GetListResponse } from 'presentation/responses/member.response';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('[ADMIN] Member Management')
@Controller('admin/member')
export class AdminMemberController {
  constructor(@Inject(MemberUseCase) private readonly memberUseCase: MemberUseCase) {}

  @ApiOperation({
    summary: 'Listing members',
    description: 'Admin can search members by id, name, or can filter by membership level, account status',
  })
  @ApiParam({
    name: 'searchCategory',
    type: 'string',
    description: 'Choose either searching by id/name',
    enum: ['id', 'name'],
    required: false,
  })
  @ApiParam({
    name: 'searchKeyword',
    type: 'string',
    description: 'Member id/name must contains keywords',
    required: false,
  })
  @ApiParam({
    name: 'status',
    type: 'AccountStatus',
    description: 'Filter by account status',
    enum: ['PENDING', 'APPROVED', 'SUSPENDED', 'WITHDRAWN'],
    required: false,
  })
  @ApiParam({
    name: 'level',
    type: 'MemberLevel',
    description: 'Filter by membership level',
    enum: ['PLATINUM', 'GOLD', 'SILVER', 'TWO', 'THREE'],
    required: false,
  })
  @ApiParam({
    name: 'pageSize',
    type: 'number',
    description: 'Number of member items per page',
    required: false,
  })
  @ApiParam({
    name: 'pageNumber',
    type: 'number',
    description: 'N_th batch of [pageSize]',
    required: false,
  })
  @Get()
  // @UseGuards(JWTAuthGuard)
  async getList(@Query() query: GetListRequest): Promise<BaseResponse<GetListResponse>> {
    return BaseResponse.of(await this.memberUseCase.getList(query));
  }
}
