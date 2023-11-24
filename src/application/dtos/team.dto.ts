import {  Team, TeamStatus } from "@prisma/client"

export class TeamDTO {
    id?: number
    code: string
    name: string
    status: TeamStatus
    leaderId: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    constructor(
        id: number,
        code: string,
        name: string,
        status: TeamStatus,
        leaderId: number,
        isActive?: boolean,
        createdAt?: Date | string,
        updatedAt?: Date | string
      ) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.status = status;
        this.leaderId = leaderId;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
      }
      static from(domain: Team): TeamDTO {
        return new TeamDTO(domain.id, domain.code, domain.name, domain.status, domain.leaderId, domain.isActive, domain.createdAt, domain.updatedAt);
      }
}