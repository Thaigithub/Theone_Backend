import { ApiProperty } from '@nestjs/swagger';
import {
    Account,
    BasicHealthSafetyCertificate,
    Career,
    Certificate,
    City,
    Code,
    District,
    File,
    Member,
    SpecialLicense,
    Team,
} from '@prisma/client';

class CareerDetail {
    companyName: Career['companyName'];
    siteName: Career['siteName'];
    startWorkDate: Career['startDate'];
    endWorkDate: Career['endDate'];
}

class TeamDetail {
    name: Team['name'];
    totalMembers: Team['totalMembers'];
    totalExperienceYears: Member['totalExperienceYears'];
    totalExperienceMonths: Member['totalExperienceMonths'];
}

class CertificateDetail {
    qualification: Code['codeName'];
    certificateNumber: Certificate['certificateNumber'];
    keyOfPhoto: File['key'];
}

class ConstrucionEquimentDetail {
    deviceName: SpecialLicense['name'];
    registrationNumber: SpecialLicense['licenseNumber'];
}

export class ManpowerCompanyGetMemberDetailResponse {
    @ApiProperty({ type: 'string' })
    name: Member['name'];

    @ApiProperty({ type: 'string' })
    username: Account['username'];

    @ApiProperty({ type: 'string' })
    contact: Member['contact'];

    @ApiProperty({ type: 'string' })
    email: Member['email'];

    @ApiProperty({ type: 'string' })
    occupation: Code['codeName'];

    @ApiProperty({ type: 'string' })
    desiredSalary: Member['desiredSalary'];

    @ApiProperty({ type: 'string' })
    districtEnglishName: District['englishName'];

    @ApiProperty({ type: 'string' })
    districtKoreanName: District['koreanName'];

    @ApiProperty({ type: 'string' })
    citynglishName: City['englishName'];

    @ApiProperty({ type: 'string' })
    cityKoreanName: City['koreanName'];

    @ApiProperty({
        type: 'object',
        properties: {
            list: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        companyName: {
                            type: 'string',
                        },
                        siteName: {
                            type: 'string',
                        },
                        startWorkDate: {
                            type: 'string',
                            format: 'date',
                        },
                        endWorkDate: {
                            type: 'string',
                            format: 'date',
                        },
                    },
                },
            },
            total: {
                type: 'number',
            },
        },
    })
    careers: {
        list: CareerDetail[];
        total: number;
    };

    @ApiProperty({
        type: 'object',
        properties: {
            list: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                        },
                        totalMembers: {
                            type: 'number',
                        },
                        totalExperienceYears: {
                            type: 'string',
                        },
                        totalExperienceMonths: {
                            type: 'string',
                        },
                    },
                },
            },
            total: {
                type: 'number',
            },
        },
    })
    teams: {
        list: TeamDetail[];
        total: number;
    };

    @ApiProperty({
        type: 'object',
        properties: {
            registrationNumber: {
                type: 'string',
            },
            certificateNumber: {
                type: 'string',
            },
            keyOfPhoto: {
                type: 'string',
            },
        },
    })
    basicHealthAndSafetyEducation: {
        registrationNumber: BasicHealthSafetyCertificate['registrationNumber'];
        dateOfCompletion: BasicHealthSafetyCertificate['dateOfCompletion'];
        keyOfPhoto: File['key'];
    };

    @ApiProperty({
        type: 'object',
        properties: {
            list: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        qualification: {
                            type: 'string',
                        },
                        certificateNumber: {
                            type: 'number',
                        },
                        keyOfPhoto: {
                            type: 'string',
                        },
                    },
                },
            },
            total: {
                type: 'number',
            },
        },
    })
    certificates: {
        list: CertificateDetail[];
        total: number;
    };

    @ApiProperty({
        type: 'object',
        properties: {
            list: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        deviceName: {
                            type: 'string',
                        },
                        registrationNumber: {
                            type: 'number',
                        },
                    },
                },
            },
            total: {
                type: 'number',
            },
        },
    })
    construcionEquiments: {
        list: ConstrucionEquimentDetail[];
        total: number;
    };
}
