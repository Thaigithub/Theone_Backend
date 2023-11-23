import { $Enums, Prisma } from '@prisma/client';
import { BaseEntity } from './base.entity';

export class AuthenticationProvider extends BaseEntity implements Prisma.AuthenticationProviderUncheckedCreateInput {
  id?: number;
  key: string;
  type: $Enums.AuthenticationProviderType;
  accountId: number;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
