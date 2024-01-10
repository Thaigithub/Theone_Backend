import { Career, Code } from '@prisma/client';

export class CareerMemberGetDetailGeneralResponse {
    companyName: Career['companyName'];
    siteName: Career['siteName'];
    startDate: Career['startDate'];
    endDate: Career['endDate'];
    occupationName: Code['codeName'];
    isExperienced: boolean;
}
