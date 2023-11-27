export class PageInfo {
  total: number;
}

export class Pagination<T> {
  data: T[];
  pageInfo: PageInfo;
}
