import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PortoneService } from './portone.service';

@Module({
    imports: [PrismaModule],
    providers: [PortoneService],
    exports: [PortoneService],
})
export class PortoneModule {}
