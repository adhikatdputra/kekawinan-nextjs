export interface User {
  id: string;
  email: string;
  fullname: string;
  level: string;
  token: string;
  exp_token: number;
  refresh_token: string;
  exp_refresh_token: number;
}
