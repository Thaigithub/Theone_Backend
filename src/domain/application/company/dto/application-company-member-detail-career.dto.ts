export class ApplicationCompanyMemberDetailCareerDTO {
    companyName: string;
    siteName: string;
    occupation: {
        code: string;
        codeName: string;
    };
    startDate: Date;
    endDate: Date;
    experiencedYears: number;
    experiencedMonths: number;
}
