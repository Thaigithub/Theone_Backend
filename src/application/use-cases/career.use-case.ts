import { GetCareerListResponse } from 'presentation/responses/career.response';
import { CreateCareerRequest, GetCareerListRequest } from 'presentation/requests/career.request';

export interface CareerUseCase {
  getList(query: GetCareerListRequest, request: any): Promise<GetCareerListResponse>;
  createCareer(body: CreateCareerRequest, request: any): Promise<void>;
  deleteCareer(careerId: number, request: any): Promise<void>;
}

export const CareerUseCase = Symbol('CareerUseCase');
