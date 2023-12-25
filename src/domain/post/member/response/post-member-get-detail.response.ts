import { ApiProperty } from '@nestjs/swagger';
import { City, Code, District, ExperienceType, File, Post, SalaryType, Site, Workday } from '@prisma/client';

export class PostMemberGetDetailResponse {
    @ApiProperty({
        type: 'object',
        properties: {
            name: {
                type: 'string',
            },
            startDate: {
                type: 'string',
                format: 'date',
            },
            endDate: {
                type: 'string',
                format: 'date',
            },
            numberOfPeople: {
                type: 'number',
            },
            description: {
                type: 'string',
            },
        },
    })
    public postInformation: {
        name: Post['name'];
        startDate: string;
        endDate: string;
        numberOfPeople: Post['numberOfPeople'];
        description: Post['postEditor'];
    };

    @ApiProperty({
        type: 'object',
        properties: {
            experienceType: {
                type: 'enum',
                example: [...Object.values(ExperienceType)],
            },
            occupation: {
                type: 'string',
            },
            specialNote: {
                type: 'string',
            },
            isEligibleToApply: {
                type: 'boolean',
            },
        },
    })
    public eligibility: {
        experienceType: Post['experienceType'];
        occupation: Code['codeName'];
        specialNote: Code['codeName'];
        isEligibleToApply: boolean;
    };

    @ApiProperty({
        type: 'object',
        properties: {
            salaryType: {
                type: 'enum',
                example: [...Object.values(SalaryType)],
            },
            salaryAmount: {
                type: 'number',
            },
            startWortkDate: {
                type: 'string',
                format: 'date',
            },
            endWorkDate: {
                type: 'string',
                format: 'date',
            },
            workday: {
                type: 'array',
                example: [...Object.values(Workday)],
            },
            startWorkTime: {
                type: 'string',
                format: 'time',
                example: '12:34:56',
            },
            tartWorkTime: {
                type: 'string',
                format: 'time',
                example: '12:34:56',
            },
        },
    })
    public workingCondition: {
        salaryType: Post['salaryType'];
        salaryAmount: Post['salaryAmount'];
        startWorkDate: string;
        endWorkDate: string;
        workday: Post['workday'];
        startWorkTime: string;
        endWorkTime: string;
    };

    @ApiProperty({
        type: 'object',
        properties: {
            companyLogoKey: {
                type: 'string',
            },
            siteName: {
                type: 'string',
            },
            siteAddress: {
                type: 'string',
            },
            siteAddressCity: {
                type: 'string',
            },
            siteAddressDistrict: {
                type: 'string',
            },
            personInCharge: {
                type: 'string',
            },
            personInChargeContact: {
                type: 'string',
            },
            contact: {
                type: 'string',
            },
            originalBuilding: {
                type: 'string',
            },
        },
    })
    public siteInformation: {
        companyLogoKey: File['key'];
        siteName: Site['name'];
        siteAddress: Site['address'];
        siteAddressCity: City['englishName'];
        siteAddressDistrict: District['englishName'];
        personInCharge: Site['personInCharge'];
        personInChargeContact: Site['personInChargeContact'];
        contact: Site['contact'];
        originalBuilding: Site['originalBuilding'];
    };

    @ApiProperty({
        type: 'string',
    })
    public workLocation: Post['workLocation'];
}
