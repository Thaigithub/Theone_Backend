import { Code, ExperienceType, HeadhuntingRequest, Post } from '@prisma/client';

export class HeadhuntingAdminRequestDTO {
    detail: HeadhuntingRequest['detail'];
    career: ExperienceType;
    codeName: Code['name'];
    postName: Post['name'];
}
