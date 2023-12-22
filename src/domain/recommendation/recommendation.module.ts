import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { RecommendationCompanyController } from './company/recommendation.controller';
import { RecommendationCompanyService } from './company/recommendation.service';

@Module({
    imports: [PrismaModule],
    controllers: [RecommendationCompanyController],
    providers: [RecommendationCompanyService],
    exports: [RecommendationCompanyService],
})
export class RecommendationModule {}
