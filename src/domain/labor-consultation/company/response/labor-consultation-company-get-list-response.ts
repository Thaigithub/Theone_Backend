import { LaborConsultation } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

class LaborConsultationResponse {
    id: LaborConsultation['id'];
    title: LaborConsultation['questionTitle'];
    status: LaborConsultation['status'];
    createdAt: LaborConsultation['createdAt'];
    files: FileResponse[];
}

export class LaborConsultationCompanyGetListResponse extends PaginationResponse<LaborConsultationResponse> {}
