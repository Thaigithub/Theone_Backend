import { Injectable } from "@nestjs/common";
import { BaseEntity } from "./entities/base.entity";

@Injectable()
export abstract class BaseRepository<E extends BaseEntity> {
  abstract findAll(): Promise<E[]>;
  abstract find(id: number): Promise<E>;
  abstract create(data: any): Promise<E>;
  abstract update(id: number, data: any): Promise<E>;
  abstract delete(id: number): Promise<E>;
  abstract softDelete(id: number) : Promise<E>;
}