import { Code, Company, HeadhuntingRequest, Post, RequestObject, Site } from '@prisma/client';

export class HeadhuntingAdminGetDetailRequestResponse {
    id: HeadhuntingRequest['id'];
    companyName: Company['name'];
    phone: Company['phone'];
    siteName: Site['name'];
    presentativeName: Company['presentativeName'];
    object: RequestObject;
    postName: Post['name'];
    detail: string;
    email: Company['email'];
    occupation: Code['name'];
}
