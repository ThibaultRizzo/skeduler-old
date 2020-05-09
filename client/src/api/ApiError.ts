export default class ApiError extends Error {
  readonly httpStatus: number;
  readonly errors?: Record<string, string>;

  constructor(
    httpStatus: number,
    content: string | { message: string; errors?: Record<string, string> },
  ) {
    const message = typeof content === 'string' ? content : content.message;
    super(message);
    this.httpStatus = httpStatus;
    if (typeof content !== 'string') {
      this.errors = content.errors;
    }
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
