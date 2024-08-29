/**
 * A utility class for formatting HTTP responses.
 */
export class ResponseFormatter {
  /**
   * Formats a successful HTTP response.
   *
   * @param {number} statusCode - The HTTP status code to return (e.g., 200, 201).
   * @param {string} message - A message providing details about the success.
   * @param {any} [data=null] - Optional data to include in the response. Defaults to `null` if not provided.
   * @returns {{statusCode: number, message: string, data: any}} An object containing the status code, message, and optional data.
   */
  static success(statusCode: number, message: string, data: any = null) {
    return {
      statusCode,
      message,
      data,
    };
  }

  /**
   * Formats an error HTTP response.
   *
   * @param {number} statusCode - The HTTP status code to return (e.g., 400, 500).
   * @param {string} message - A message describing the error.
   * @param {any} [error=null] - Optional error details to include in the response. Defaults to `null` if not provided.
   * @returns {{statusCode: number, message: string, error?: any}} An object containing the status code, message, and optional error details.
   */
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
