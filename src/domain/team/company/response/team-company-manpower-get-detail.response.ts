import { ApiProperty } from '@nestjs/swagger';
import { City, Code, District, Member, Team } from '@prisma/client';

class MemberDetail {
    id: Member['id'];
    name: Member['name'];
    contact: Member['contact'];
    totalExperienceYears: Member['totalExperienceYears'];
    totalExperienceMonths: Member['totalExperienceMonths'];
    occupation: Code['codeName'];
    districtEnglishName: District['englishName'];
    districtKoreanName: District['koreanName'];
    cityEnglishName: City['englishName'];
    cityKoreanName: City['koreanName'];
}

export class TeamCompanyManpowerGetDetailResponse {
    @ApiProperty({ type: 'string' })
    name: Team['name'];

    @ApiProperty({ type: 'string' })
    totalMembers: Team['totalMembers'];

    @ApiProperty({ type: 'string' })
    contact: Member['contact'];

    @ApiProperty({ type: 'string' })
    districtEnglishName: District['englishName'];

    @ApiProperty({ type: 'string' })
    districtKoreanName: District['koreanName'];

    @ApiProperty({ type: 'string' })
    cityEnglishName: City['englishName'];

    @ApiProperty({ type: 'string' })
    cityKoreanName: City['koreanName'];

    @ApiProperty({
        type: 'array',
        items: {
            type: 'object',
            properties: {
                id: {
                    type: 'number',
                },
                name: {
                    type: 'string',
                },
                contact: {
                    type: 'string',
                },
                totalExperienceYears: {
                    type: 'number',
                },
                totalExperienceMonths: {
                    type: 'number',
                },
                occupation: {
                    type: 'string',
                },
                districtEnglishName: {
                    type: 'string',
                },
                districtKoreanName: {
                    type: 'string',
                },
                cityEnglishName: {
                    type: 'string',
                },
                cityKoreanName: {
                    type: 'string',
                },
            },
        },
    })
    members: MemberDetail[];
}
