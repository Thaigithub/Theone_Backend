import { $Enums, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { BaseEntity } from './base.entity';

export class AuthenticationProvider
  extends BaseEntity
  implements Prisma.AuthenticationProviderGetPayload<Prisma.AuthenticationProviderDefaultArgs<DefaultArgs>>
{
  id: number;
  key: string;
  type: $Enums.AuthenticationProviderType;
  userId: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
