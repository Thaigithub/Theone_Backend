import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { MatchingCompanyController } from './company/matching-company.controller';
import { MatchingCompanyService } from './company/matching-company.service';

@Module({
    imports: [PrismaModule],
    controllers: [MatchingCompanyController],
    providers: [MatchingCompanyService],
})
export class MatchingModule {}
