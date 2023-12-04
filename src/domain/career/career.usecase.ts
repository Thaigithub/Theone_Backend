import { CreateCareerRequest, GetCareerListRequest } from 'domain/career/request/career.request';
import { GetCareerListResponse } from 'domain/career/response/career.response';

export interface CareerUseCase {
    getList(query: GetCareerListRequest, request: any): Promise<GetCareerListResponse>;
    createCareer(body: CreateCareerRequest, request: any): Promise<void>;
    deleteCareer(careerId: number, request: any): Promise<void>;
}

export const CareerUseCase = Symbol('CareerUseCase');
