export class ServerResponseModel<T> {
  success: boolean;
  exitCode: number;
  data: T;
  text: string;
}