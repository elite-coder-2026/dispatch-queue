export class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const badRequest = (message) =>
  new AppError(400, "bad_request", message);
export const notFound = (what) =>
  new AppError(404, "not_found", `${what} not found`);
export const conflict = (message) => new AppError(409, "conflict", message);
