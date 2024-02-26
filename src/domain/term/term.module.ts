import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { TermAdminController } from './admin/term-admin.controller';
import { TermAdminService } from './admin/term-admin.service';
import { TermGuestController } from './guest/term-guest.controller';
import { TermGuestService } from './guest/term-guest.service';

@Module({
    imports: [PrismaModule],
    controllers: [TermAdminController, TermGuestController],
    providers: [TermAdminService, TermGuestService],
})
export class TermModule {}
