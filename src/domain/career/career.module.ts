import { Module } from '@nestjs/common';
import { CareerRepository } from 'domain/career/career.repository';
import { CareerRepositoryImpl } from 'domain/career/career.repository.impl';
import { CareerUseCase } from 'domain/career/career.usecase';
import { CareerUseCaseImpl } from 'domain/career/career.usecase.impl';
import { MemberCareerController } from 'domain/career/member-career.controller';
import { PrismaModule } from '../../helpers/entity/prisma.module';
import { MemberModule } from '../member/member.module';

@Module({
    imports: [PrismaModule, MemberModule],
    controllers: [MemberCareerController],
    providers: [
        {
            provide: CareerUseCase,
            useClass: CareerUseCaseImpl,
        },
        {
            provide: CareerRepository,
            useClass: CareerRepositoryImpl,
        },
    ],
    exports: [CareerUseCase, CareerRepository],
})
export class CareerModule {}
