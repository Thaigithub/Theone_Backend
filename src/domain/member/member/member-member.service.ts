import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class MemberMemberService {
    constructor(private readonly prismaService: PrismaService) {}
}
