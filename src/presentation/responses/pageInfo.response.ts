export class PageInfo {
  pageSize: number;
  next: number;
  pageNumber: number;
  prev: number;
  total: number;
}

export class Pagination<T>{
    data:  T[];
    pageInfo:PageInfo;
}