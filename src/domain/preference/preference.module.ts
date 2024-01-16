import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { PreferenceMemberController } from './member/preference-member.controller';
import { PreferenceMemberService } from './member/preference-member.service';

@Module({
    imports: [PrismaModule],
    controllers: [PreferenceMemberController],
    providers: [PreferenceMemberService],
})
export class PreferenceModule {}
