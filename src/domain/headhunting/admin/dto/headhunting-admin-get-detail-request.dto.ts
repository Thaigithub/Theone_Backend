import { Code, ExperienceType, HeadhuntingRequest, Post } from '@prisma/client';

export class HeadhuntingAdminRequestDTO {
    detail: HeadhuntingRequest['detail'];
    career: ExperienceType;
    specialOccupationCodeName: Code['codeName'];
    postName: Post['name'];
}
