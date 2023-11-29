import { $Enums, Prisma } from '@prisma/client';
import { BaseEntity } from './base.entity';

export class Company extends BaseEntity implements Prisma.CompanyUncheckedCreateInput {
  id: number;
  accountId: number;
  name: string;
  address: string;
  estDate: Date | string;
  businessRegNumber: string;
  corporateRegNumber: string;
  type: $Enums.CompanyType;
  email: string;
  phone: string;
  presentativeName: string;
  contactPhone: string;
  contactName: string;
}
