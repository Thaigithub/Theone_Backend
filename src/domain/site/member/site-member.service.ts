import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { SiteMemberUpdateInterestResponse } from './response/site-member-update-interest.response';

@Injectable()
export class SiteMemberService {
    constructor(private prismaService: PrismaService) {}

    async updateInterestSite(accountId: number, id: number): Promise<SiteMemberUpdateInterestResponse> {
        const account = await this.prismaService.account.findUnique({
            where: {
                id: accountId,
                isActive: true,
            },
            include: {
                member: true,
            },
        });

        const site = await this.prismaService.site.findUnique({
            where: {
                id: id,
                isActive: true,
            },
        });

        if (!site) {
            throw new BadRequestException('Site does not exist');
        }

        //Check exist member - site
        //If exist, remove that record
        //Else, add that record
        const application = await this.prismaService.interest.findUnique({
            where: {
                memberId_siteId: {
                    memberId: account.member.id,
                    siteId: site.id,
                },
            },
        });

        if (application) {
            await this.prismaService.interest.delete({
                where: {
                    memberId_siteId: {
                        memberId: account.member.id,
                        siteId: site.id,
                    },
                },
            });

            return { isInterested: false };
        } else {
            await this.prismaService.interest.create({
                data: {
                    member: { connect: { id: account.member.id } },
                    site: { connect: { id: site.id } },
                },
            });

            return { isInterested: true };
        }
    }
}
