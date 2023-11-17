
export class BaseResponse<T> {
  data: Nullable<T | null>
  error: any

  private constructor(data: Nullable<T>, error: any) {
    this.data = data
    this.error = error
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

type Nullable<T> = T | null;