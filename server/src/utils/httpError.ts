// thrown by services, turned into a { message } response by the error handler in src/index.ts
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
