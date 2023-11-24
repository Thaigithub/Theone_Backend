import { TeamDTO } from "application/dtos/team.dto";

export interface TeamUseCase {
    searchTeams():Promise<TeamDTO[]>;
}
export const TeamUseCase = Symbol('AdminTeamUseCase');