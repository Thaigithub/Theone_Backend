class QueryPagingInput {
    pageSize: number;
    pageNumber: number;
}

class QueryPagingOutput {
    skip: number;
    take: number;
}

export class QueryPagingHelper {
    public static queryPaging(query: QueryPagingInput): QueryPagingOutput {
        return {
            skip: query.pageNumber && query.pageSize ? (query.pageNumber - 1) * query.pageSize : undefined,
            take: query.pageNumber && query.pageSize ? query.pageSize : undefined,
        };
    }
}
