import {  Team } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { Injectable } from "@nestjs/common";
import { TeamSearchRequest } from "presentation/requests/team.request";
import { TeamDTO } from "application/dtos/team.dto";
import { Pagination } from "presentation/responses/pageInfo.response";

@Injectable()
export abstract class TeamRepository extends BaseRepository<Team> {
    abstract searchTeamFilter(request:TeamSearchRequest):Promise<Pagination<TeamDTO>>
}
