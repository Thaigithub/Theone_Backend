import { Injectable } from '@nestjs/common';
import { Career } from 'domain/career/career.entity';
import { CreateCareerRequest, GetCareerListRequest } from 'domain/career/request/career.request';
import { CareerResponse } from 'domain/career/response/career.response';
import { BaseRepository } from '../../helpers/entity/base.repository';

@Injectable()
export abstract class CareerRepository extends BaseRepository<Career> {
    abstract findByQuery(query: GetCareerListRequest, request: any): Promise<CareerResponse[]>;
    abstract countByQuery(query: GetCareerListRequest, request: any): Promise<number>;
    abstract createOne(body: CreateCareerRequest, memberId: number): Promise<void>;
    abstract deleteOne(careerId: number, memberId: number): Promise<void>;
}
