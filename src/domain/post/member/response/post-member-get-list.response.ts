import { City, Code, District, Post, Site } from '@prisma/client';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class ConstructionMachinaryResponse {
    id: Code['id'];
    codeName: Code['codeName'];
}

export class PostResponse {
    id: Post['id'];
    name: Post['name'];
    occupation: Code['codeName'];
    siteAddress: Site['address'];
    siteAddressCity: City['englishName'];
    siteAddressDistrict: District['englishName'];
    startWorkDate: string;
    endWorkDate: string;
    numberOfPeople: Post['numberOfPeople'];
    endDate: string;
}

export class PostMemberGetListResponse extends PaginationResponse<PostResponse> {}
