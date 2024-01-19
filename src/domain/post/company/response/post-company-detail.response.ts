import { ExperienceType, PostCategory, PostStatus, PostType, SalaryType, Workday } from '@prisma/client';
import { PostCompanyCodeDTO } from '../dto/post-company-code.dto';
import { PostCompanyGetItemListSiteResponse } from './post-company-get-item-list.response';

export class PostCompanyDetailResponse {
    type: PostType;
    category: PostCategory;
    status: PostStatus;
    name: string;
    startDate: Date;
    endDate: Date;
    experienceType: ExperienceType;
    numberOfPeople: number;
    specialOccupation: PostCompanyCodeDTO;
    occupation: PostCompanyCodeDTO;
    otherInformation: string;
    salaryType: SalaryType;
    salaryAmount: number;
    startWorkDate: Date;
    endWorkDate: Date;
    workday: Workday[];
    startWorkTime: Date;
    endWorkTime: Date;
    site: PostCompanyGetItemListSiteResponse;
    postEditor: string;
}
