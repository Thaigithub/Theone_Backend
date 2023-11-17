import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../base.repository";
import { User } from "../entities/user.entity";

@Injectable()
export abstract class UserRepository extends BaseRepository<User>{
  abstract findByUsername(username: string) : Promise<User>
}

