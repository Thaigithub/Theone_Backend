import { Region } from '@prisma/client';

export class RegionGetListResponse {
    id: Region['id'];
    city: {
        englishName: Region['cityEnglishName'];
        koreanName: Region['cityKoreanName'];
        district: {
            id: Region['id'];
            englishName: Region['districtEnglishName'];
            koreanName: Region['districtKoreanName'];
            cityId: Region['id'];
        }[];
    };
}
