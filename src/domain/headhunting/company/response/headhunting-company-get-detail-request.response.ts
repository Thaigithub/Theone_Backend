import { ExperienceType, RequestObject } from '@prisma/client';

export class HeadhuntingCompanyGetDetailRequestResponse {
    requests: {
        object: RequestObject;
        detail: string;
    }[];
    post: {
        name: string;
        experienceType: ExperienceType;
        code: {
            name: string;
        };
        site: {
            personInCharge: string;
        };
    };
}
