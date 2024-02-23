import { ExperienceType, PostCategory, PostStatus, PostType, SalaryType, Site, Workday } from '@prisma/client';
import { PostAdminCodeDTO } from '../dto/post-admin-code.dto';

export class PostAdminGetDetailResponse {
    siteId: Site['id'];
    category: PostCategory;
    type: PostType;
    name: string;
    startDate: Date;
    endDate: Date;
    experienceType: ExperienceType;
    numberOfPeople: number;
    occupation: PostAdminCodeDTO;
    salaryType: SalaryType;
    salaryAmount: number;
    status: PostStatus;
    startWorkDate: Date;
    endWorkDate: Date;
    workday: Workday[];
    startWorkTime: Date;
    endWorkTime: Date;
    postEditor: string;
    site: {
        name: string;
        contact: string;
        personInCharge: string;
        address: string;
        district: {
            englishName: string;
            koreanName: string;
            city: {
                englishName: string;
                koreanName: string;
            };
        };
    };
}
