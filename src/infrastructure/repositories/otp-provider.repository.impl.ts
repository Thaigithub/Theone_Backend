import { Injectable } from "@nestjs/common";
import { OtpProvider } from "domain/entities/otp-provider.entity";
import { BaseRepositoryImpl } from "./base.repository.impl";
import { OtpProviderRepository } from "domain/repositories/otp-provider.repository";
import { PrismaService } from "infrastructure/services/prisma.service";
import { PrismaModel } from "domain/entities/prisma.model";

@Injectable()
export class OtpProviderRepositoryImpl extends BaseRepositoryImpl<OtpProvider> implements OtpProviderRepository {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, PrismaModel.USER);
    this.prismaService.authenticationProvider
  }
    

  
}
