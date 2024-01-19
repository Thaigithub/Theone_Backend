import { Career, Code } from '@prisma/client';

export class CareerResponse {
    companyName: Career['companyName'];
    startDate: Career['startDate'];
    endDate: Career['endDate'];
    createdAt: Career['createdAt'];
    occupationName: Code['codeName'];
    // careerCertificationType: Career['certificationType'];
}

export class CareerMemberGetListCertificationResponse {
    healthInsurances: CareerResponse[];
    employeeInsurances: CareerResponse[];
    oneSiteInquiries: CareerResponse[];
}
