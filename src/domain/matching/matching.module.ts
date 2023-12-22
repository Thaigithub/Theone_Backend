import { Module } from '@nestjs/common';
import { RecommendationModule } from 'domain/recommendation/recommendation.module';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { MatchingCompanyController } from './company/matching-company.controller';
import { MatchingCompanyService } from './company/matching-company.service';

@Module({
    imports: [PrismaModule, RecommendationModule],
    controllers: [MatchingCompanyController],
    providers: [MatchingCompanyService],
})
export class MatchingModule {}
