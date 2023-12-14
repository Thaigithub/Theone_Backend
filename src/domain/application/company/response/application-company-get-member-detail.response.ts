import { ApiProperty } from '@nestjs/swagger';
import { ApplicationCompantMemberDetailMemberDTO } from '../dto/member-detail/application-company-member-detail-member.dto';

export class ApplicationCompanyGetMemberDetail {
    @ApiProperty({ type: ApplicationCompantMemberDetailMemberDTO })
    public member: ApplicationCompantMemberDetailMemberDTO;
}
