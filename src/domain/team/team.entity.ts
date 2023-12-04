import { $Enums, Prisma } from '@prisma/client';
import { BaseEntity } from '../../helpers/entity/base.entity';

export class Team extends BaseEntity implements Prisma.TeamUncheckedCreateInput {
    constructor(code: string, name: string, leaderId: number, isActive: boolean, status: $Enums.TeamStatus) {
        super();
        this.code = code;
        this.name = name;
        this.leaderId = leaderId;
        this.isActive = isActive;
        this.status = status;
    }
    id?: number;
    code: string;
    name: string;
    leaderId: number;
    isActive?: boolean;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    status: $Enums.TeamStatus;
    members?: Prisma.MembersOnTeamsUncheckedCreateNestedManyWithoutTeamInput;
}
