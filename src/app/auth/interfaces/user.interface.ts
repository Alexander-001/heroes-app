export interface User {
  username: string;
  password: string;
}

export interface UserService {
  token: string;
  user: User;
  CodeResult: string;
}
