import { Injectable } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { CreateCareerRequest, GetCareerListRequest } from 'presentation/requests/career.request';
import { CareerResponse } from 'presentation/responses/career.response';
import { Career } from 'domain/entities/career.entity';

@Injectable()
export abstract class CareerRepository extends BaseRepository<Career> {
  abstract findByQuery(query: GetCareerListRequest, request: any): Promise<CareerResponse[]>;
  abstract countByQuery(query: GetCareerListRequest, request: any): Promise<number>;
  abstract createOne(body: CreateCareerRequest, memberId: number): Promise<void>;
  abstract deleteOne(careerId: number, memberId: number): Promise<void>;
}
