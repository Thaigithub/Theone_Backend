import { Injectable } from '@nestjs/common';
import { Company, Member, RequestObject, Team } from '@prisma/client';
import { PrismaService } from 'services/prisma/prisma.service';
import { MatchingCompanyGetListDateEnum } from './dto/matching-company-get-list-date.enum';
import { MatchingCompanyGetListRecommendationRequest } from './request/matching-company-get-list-recommendation.request';
import { TeamMemberDetail } from './response/matching-company-get-item-recommendation-team-detail.response';
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
        const occupationIds = (query.occupationIds && query.occupationIds.split(',')) || null;
        const specialNoteIds = (query.specialOccupationIds && query.specialOccupationIds.split(',')) || null;
        const regionIds = (query.regionIds && query.regionIds.split(',')) || null;

        console.log('MATCHING QUERY', query, occupationIds, specialNoteIds, regionIds);

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
                        applyPosts: {
                            include: {
                                contract: true,
                            },
                        },
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
                                        desiredOccupation: true,
                                        applyPosts: {
                                            include: {
                                                contract: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (existMatching.length > 0) {
            const allMembers = existMatching.filter((matching) => !matching.team).map((matching) => matching.member);
            const allTeams = existMatching.filter((matching) => !matching.member).map((matching) => matching.team);

            return this.mappingResponseDTO(allMembers, allTeams);
        }

        if (!existMatching.length && query.date === MatchingCompanyGetListDateEnum.TODAY) {
            //TODO: Apply Algorithm for AutoMatching
            // Fake for now
            const members = await this.prismaService.member.findMany({
                include: {
                    specialLicenses: true,
                    certificates: true,
                    applyPosts: {
                        include: {
                            contract: true,
                        },
                    },
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
                                    desiredOccupation: true,
                                    applyPosts: {
                                        include: {
                                            contract: true,
                                        },
                                    },
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
                        totalMonths: member.totalExperienceMonths,
                        totalYears: member.totalExperienceYears,
                        specialNote: member.specialLicenses.map((special) => special.name),
                        certificate: member.certificates.map((certificate) => certificate.name),
                        numberOfTeamMembers: null,
                        memberDetail: {
                            localInformation: member.address,
                            totalMonths: member.totalExperienceMonths,
                            totalYears: member.totalExperienceYears,
                            entire: member.applyPosts?.some((application) => application.contract?.endDate > new Date())
                                ? 'On duty'
                                : 'Looking for a job',
                        },
                        teamDetail: null,
                    } as MatchingCompanyGetItemRecommendation;
                }),
                ...teams.map((team) => {
                    return {
                        id: team.id,
                        object: RequestObject.TEAM,
                        name: team.name,
                        contact: team.leader.contact,
                        totalMonths: team.totalExperienceMonths,
                        totalYears: team.totalExperienceYears,
                        specialNote: this.getAllSpecialNoteTeam(team),
                        certificate: this.getAllCertificareTeam(team),
                        numberOfTeamMembers: team.members.length + 1,
                        memberDetail: null,
                        teamDetail: {
                            leaderName: team.leader.name,
                            leaderContact: team.leader.contact,
                            leaderAddress: team.leader.address,
                            totalYears: team.totalExperienceYears,
                            totalMonths: team.totalExperienceMonths,
                            member: team.members.map((memberTeam) => {
                                const member = memberTeam.member;
                                const memberResponse: TeamMemberDetail = {
                                    rank: member.id === team.leaderId ? 'TEAM LEADER' : 'TEAM MEMBER',
                                    name: member.name,
                                    contact: member.contact,
                                    totalYears: member.totalExperienceYears,
                                    totalMonths: member.totalExperienceMonths,
                                    occupation: member.desiredOccupation?.codeName || null,
                                    workingStatus: member.applyPosts?.some(
                                        (application) => application.contract?.endDate > new Date(),
                                    )
                                        ? 'On duty'
                                        : 'Looking for a job',
                                };

                                return memberResponse;
                            }),
                        },
                    } as MatchingCompanyGetItemRecommendation;
                }),
            ],
        };

        return response;
    }
}
