import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { FilterController } from './filter.controller';
import { FilterService } from './filter.service';

@Module({
    imports: [PrismaModule],
    controllers: [FilterController],
    providers: [FilterService],
    exports: [FilterService],
})
export class FilterModule {}
