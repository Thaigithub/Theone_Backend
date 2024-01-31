import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { InterviewMemberGetListStatus } from '../enum/interview-member-get-list-status.enum';

export class InterviewMemberGetListRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @IsEnum(InterviewMemberGetListStatus)
    status: InterviewMemberGetListStatus;

    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    startDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    endDate: string;
}
