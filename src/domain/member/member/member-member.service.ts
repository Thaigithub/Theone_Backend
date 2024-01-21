import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';
import { MemberMemberGetOneRequest } from './request/member-member-get-one.request';
import { MemberMemberGetOneResponse } from './response/member-member-get-one.response';

@Injectable()
export class MemberMemberService {
    constructor(private prismaService: PrismaService) {}
    async getOne(query: MemberMemberGetOneRequest): Promise<MemberMemberGetOneResponse> {
        const member = await this.prismaService.member.findFirst({
            where: {
                name: query.username,
                contact: query.contact,
            },
            select: {
                id: true,
                name: true,
                contact: true,
            },
        });
        if (!member) {
            return {
                id: null,
                name: null,
                contact: null,
            };
        }
        return member;
    }
}
