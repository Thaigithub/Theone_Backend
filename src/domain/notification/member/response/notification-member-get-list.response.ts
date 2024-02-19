import { AccountType, Notification } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class NotificationMemberGetResponse {
    id: Notification['id'];
    createdAt: Notification['createdAt'];
    title: Notification['title'];
    content: Notification['content'];
    status: Notification['status'];
    type: Notification['type'];
    typeId: Notification['typeId'];
    accountType: AccountType;
}

export class NotificationMemberGetListResponse extends PaginationResponse<NotificationMemberGetResponse> {}
