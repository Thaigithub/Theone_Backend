import { ExperienceType, PostCategory, PostStatus, PostType, SalaryType, Site, Workday } from '@prisma/client';
import { PostCompanyCodeDTO } from '../dto/post-company-code.dto';

export class PostCompanyGetDetailResponse {
    type: PostType;
    category: PostCategory;
    status: PostStatus;
    name: string;
    startDate: Date;
    endDate: Date;
    experienceType: ExperienceType;
    numberOfPeople: number;
    occupation: PostCompanyCodeDTO;
    otherInformation: string;
    salaryType: SalaryType;
    salaryAmount: number;
    startWorkDate: Date;
    endWorkDate: Date;
    workday: Workday[];
    startWorkTime: Date;
    endWorkTime: Date;
    site: {
        name: string;
        id: Site['id'];
    };
    postEditor: string;
}
