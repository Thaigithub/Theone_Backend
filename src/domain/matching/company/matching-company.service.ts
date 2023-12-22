import { Injectable } from '@nestjs/common';
import { Company, Member, RequestObject, Team } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { MatchingCompanyGetListDateEnum } from './dto/matching-company-get-list-date.enum';
import { MatchingCompanyGetListRecommendationRequest } from './request/matching-company-get-list-recommendation.request';
import {
    MatchingCompanyGetItemRecommendation,
    MatchingCompanyGetListRecommendation,
} from './response/matching-company-get-list-recommendation.response';

@Injectable()
export class MatchingCompanyService {
    constructor(private readonly prismaService: PrismaService) {}

    async getList(
        accountId: number,
        query: MatchingCompanyGetListRecommendationRequest,
    ): Promise<MatchingCompanyGetListRecommendation> {
        console.log('MATCHING QUERY', query);

        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                company: true,
            },
        });

        const dateQuery: Date = new Date();
        switch (query.date) {
            case MatchingCompanyGetListDateEnum.TODAY:
                break;
            case MatchingCompanyGetListDateEnum.ONE_DAY_AGO:
                dateQuery.setDate(dateQuery.getDate() - 1);
                break;
            case MatchingCompanyGetListDateEnum.TWO_DAYS_AGO:
                dateQuery.setDate(dateQuery.getDate() - 2);
                break;
            case MatchingCompanyGetListDateEnum.THREE_DAYS_AGO:
                dateQuery.setDate(dateQuery.getDate() - 3);
                break;
            default:
                break;
        }

        const existMatching = await this.prismaService.matchingRecommendation.findMany({
            where: {
                assignedAt: dateQuery,
            },
            include: {
                member: {
                    include: {
                        specialLicenses: true,
                        certificates: true,
                    },
                },
                team: {
                    include: {
                        leader: true,
                        members: {
                            include: {
                                member: {
                                    include: {
                                        specialLicenses: true,
                                        certificates: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (existMatching) {
            const allMembers = existMatching.filter((matching) => !matching.team).map((matching) => matching.member);
            const allTeams = existMatching.filter((matching) => !matching.member).map((matching) => matching.team);

            return this.mappingResponseDTO(allMembers, allTeams);
        }

        if (!existMatching && query.date === MatchingCompanyGetListDateEnum.TODAY) {
            //TODO: Apply Algorithm for AutoMatching
            // Fake for now
            const members = await this.prismaService.member.findMany({
                include: {
                    specialLicenses: true,
                    certificates: true,
                },
                take: 10,
            });

            const teams = await this.prismaService.team.findMany({
                include: {
                    leader: true,
                    members: {
                        include: {
                            member: {
                                include: {
                                    specialLicenses: true,
                                    certificates: true,
                                },
                            },
                        },
                    },
                },
                take: 5,
            });

            //Save history
            await this.addHistory(account.company, members, teams);

            return this.mappingResponseDTO(members, teams);
        }
    }

    getAllSpecialNoteTeam(team): string[] {
        const members = team.members;
        const listSpecial: string[] = [];
        const setSpecial = new Set<string>();
        members.forEach((member) => {
            const specialLicenseList: string[] = member.member.specialLicenses.map((specialLicense) => specialLicense.name);
            specialLicenseList.forEach((specialLicense) => {
                setSpecial.add(specialLicense);
            });
        });
        setSpecial.forEach((set) => {
            listSpecial.push(set);
        });

        return listSpecial;
    }

    getAllCertificareTeam(team): string[] {
        const members = team.members;
        const listCertificate: string[] = [];
        const setCertificate = new Set<string>();
        members.forEach((member) => {
            const certificateList: string[] = member.member.certificates.map((cer) => cer.name);
            certificateList.forEach((cer) => {
                setCertificate.add(cer);
            });
        });
        setCertificate.forEach((set) => {
            listCertificate.push(set);
        });

        return listCertificate;
    }

    async addHistory(company: Company, members: Member[], teams: Team[]) {
        await this.prismaService.matchingRecommendation.createMany({
            data: [
                ...members.map((member) => {
                    return { memberId: member.id, companyId: company.id };
                }),
                ...teams.map((team) => {
                    return { teamId: team.id, companyId: company.id };
                }),
            ],
        });
    }

    mappingResponseDTO(members, teams): MatchingCompanyGetListRecommendation {
        const response: MatchingCompanyGetListRecommendation = {
            data: [
                ...members.map((member) => {
                    return {
                        id: member.id,
                        object: RequestObject.INDIVIDUAL,
                        name: member.name,
                        contact: member.contact,
                        career: member.totalExperienceYears + 'years' + member.totalExperienceMonths + 'months',
                        specialNote: member.specialLicenses.map((special) => special.name),
                        certificate: member.certificates.map((certificate) => certificate.name),
                        numberOfTeamMembers: null,
                    } as MatchingCompanyGetItemRecommendation;
                }),
                ...teams.map((team) => {
                    return {
                        id: team.id,
                        object: RequestObject.TEAM,
                        name: team.name,
                        contact: team.leader.contact,
                        career: team.totalExperienceYears + 'years' + team.totalExperienceMonths + 'months',
                        specialNote: this.getAllSpecialNoteTeam(team),
                        certificate: this.getAllCertificareTeam(team),
                        numberOfTeamMembers: team.members.length + 1,
                    } as MatchingCompanyGetItemRecommendation;
                }),
            ],
        };

        return response;
    }
}
