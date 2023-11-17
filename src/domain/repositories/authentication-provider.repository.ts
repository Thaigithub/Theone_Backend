import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../base.repository";
import { AuthenticationProvider } from "../entities/authentication-provider.entity";

@Injectable()
export abstract class AuthenticationProviderRepository extends BaseRepository<AuthenticationProvider> {
  abstract findByUserId(userId: number) : Promise<AuthenticationProvider>
}