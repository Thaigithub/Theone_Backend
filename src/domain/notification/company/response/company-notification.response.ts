import { Notification } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class CompanyGetNotificationResponse {
    id: Notification['id'];
    title: Notification['title'];
    content: Notification['content'];
    createdAt: Notification['createdAt'];
    updatedAt: Notification['updatedAt'];
    type: Notification['type'];
}

export class NotificationCompanyGetListResponse extends PaginationResponse<CompanyGetNotificationResponse> {}
