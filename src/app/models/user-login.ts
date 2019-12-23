export class UserLoginModel {
  email: string;
  password: string;
  orgId?: string;
  language: number;

  constructor() {
    this.language = 0;
  }
}