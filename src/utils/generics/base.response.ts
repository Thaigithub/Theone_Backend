import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse<T> {
    @ApiProperty()
    data: Nullable<T | null>;
    @ApiProperty()
    error: any;

    private constructor(data: Nullable<T>, error: any) {
        this.data = data;
        this.error = error;
    }

    public static of<T>(data: T): BaseResponse<T> {
        return new BaseResponse(data, null);
    }

    public static error<T>(error: any): BaseResponse<Nullable<T>> {
        return new BaseResponse(null, error);
    }

    public static ok<T>(): BaseResponse<Nullable<T>> {
        return new BaseResponse(null, null);
    }
}

// export class PaginationResponse<T> {
//   data: Nullable<T | null>;
//   total: any;

//   private constructor(data: Nullable<T>, total: number) {
//     this.data = data;
//     this.total = total;
//   }

//   public static of<T>(data: T[]): PaginationResponse<T[]> {
//     return new PaginationResponse(data, data.length);
//   }

//   public static ok<T>(data: PaginationResponse<T[]>): PaginationResponse<T[]> {
//     return new PaginationResponse(data.data, data.total);
//   }
// }

type Nullable<T> = T | null;
