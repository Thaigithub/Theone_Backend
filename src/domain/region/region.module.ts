import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';

@Module({
    imports: [PrismaModule],
    controllers: [RegionController],
    providers: [RegionService],
    exports: [RegionService],
})
export class RegionModule {}
