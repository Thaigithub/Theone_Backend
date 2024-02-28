import { Code, Post, Region, Site } from '@prisma/client';
import { FileResponse } from 'utils/generics/file.response';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class ConstructionMachinaryResponse {
    id: Code['id'];
    codeName: Code['name'];
}

export class PostResponse {
    id: Post['id'];
    name: Post['name'];
    occupation: Code['name'];
    logo: FileResponse;
    siteAddress: Site['address'];
    siteAddressCity: Region['cityEnglishName'];
    siteAddressDistrict: Region['districtEnglishName'];
    startWorkDate: string;
    endWorkDate: string;
    numberOfPeople: Post['numberOfPeoples'];
    endDate: string;
}

export class PostMemberGetListResponse extends PaginationResponse<PostResponse> {}
