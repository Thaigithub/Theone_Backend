import { Injectable } from '@nestjs/common';
import { PrismaService } from 'services/prisma/prisma.service';

@Injectable()
export class LaborCompanyService {
    constructor(private prismaService: PrismaService) {}
}
