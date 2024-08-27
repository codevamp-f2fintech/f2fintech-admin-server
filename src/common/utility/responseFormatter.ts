export class ResponseFormatter {
  static success(statusCode: number, message: string, data: any = null) {
    return {
      statusCode,
      message,
      data,
    };
  }

  static error(statusCode: number, message: string, error: any = null) {
    return error
      ? {
          statusCode,
          message,
          error,
        }
      : {
          statusCode,
          message,
        };
  }
}
