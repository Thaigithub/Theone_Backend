import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { PostCompanyController } from './company/post-company.controller';
import { PostCompanyService } from './company/post-company.service';

@Module({
    imports: [PrismaModule],
    controllers: [PostCompanyController],
    providers: [PostCompanyService],
    exports: [PostCompanyService],
})
export class PostModule {}
