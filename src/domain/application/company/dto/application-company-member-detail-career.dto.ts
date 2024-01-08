import { ApplicationCompanyMemberDetailCodeDTO } from './application-company-member-detail-code.dto';

export class ApplicationCompanyMemberDetailCareerDTO {
    companyName: string;
    siteName: string;
    occupation: ApplicationCompanyMemberDetailCodeDTO;
    startDate: Date;
    endDate: Date;
    experiencedYears: number;
    experiencedMonths: number;
}
