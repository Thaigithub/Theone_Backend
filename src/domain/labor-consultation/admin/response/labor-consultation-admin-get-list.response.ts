import { InquirerType, LaborConsultation } from '@prisma/client';

import { PaginationResponse } from 'utils/generics/pagination.response';

class Inquirer {
    type: InquirerType;
    name: string;
}

class LaborConsultationResponse {
    id: LaborConsultation['id'];
    inquirer: Inquirer;
    laborConsultationType: LaborConsultation['laborConsultationType'];
    title: LaborConsultation['questionTitle'];
    status: LaborConsultation['status'];
    createdAt: LaborConsultation['createdAt'];
}

export class LaborConsultationAdminGetListResponse extends PaginationResponse<LaborConsultationResponse> {}
