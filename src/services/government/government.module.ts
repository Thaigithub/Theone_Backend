import { Module } from '@nestjs/common';
import { GovernmentService } from './government.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [GovernmentService],
    exports: [GovernmentService],
})
export class GovernmentModule {}
