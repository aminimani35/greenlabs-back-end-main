export interface BaseResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class ApiResponse<T = any> implements BaseResponse<T> {
  constructor(
    public success: boolean,
    public data?: T,
    public message?: string,
    public error?: string,
  ) {}

  static ok<T>(data: T, message?: string): ApiResponse<T> {
    return new ApiResponse(true, data, message);
  }

  static fail<T>(error: string, data?: T): ApiResponse<T> {
    return new ApiResponse(false, data, undefined, error);
  }
}
