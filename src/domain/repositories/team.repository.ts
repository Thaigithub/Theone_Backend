import {  Team } from "@prisma/client";
import { BaseRepository } from "./base.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class TeamRepository extends BaseRepository<Team> {
  
}
