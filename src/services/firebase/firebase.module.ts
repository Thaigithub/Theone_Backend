import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { FirebaseService } from './firebase.service';

@Module({
    imports: [PrismaModule],
    providers: [FirebaseService],
    exports: [FirebaseService],
})
export class FireBaseModule {}
