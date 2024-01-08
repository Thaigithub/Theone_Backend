import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { MemberSearchCategory } from '../dto/evaluation-company-get-list-request.enum';
import { EvaluationCompanyGetListGenericRequest } from './evaluation-company-get-list-generic.request';

export class EvaluationCompanyGetListMembersRequest extends EvaluationCompanyGetListGenericRequest {
    @ApiProperty({
        type: 'enum',
        enum: MemberSearchCategory,
        required: false,
    })
    @Expose()
    @IsEnum(MemberSearchCategory)
    @IsOptional()
    searchCategory: MemberSearchCategory;
}
