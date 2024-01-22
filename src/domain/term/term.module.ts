import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { TermAdminController } from './admin/term-admin.controller';
import { TermAdminService } from './admin/term-admin.service';

@Module({
    imports: [PrismaModule],
    controllers: [TermAdminController],
    providers: [TermAdminService],
})
export class TermModule {}
