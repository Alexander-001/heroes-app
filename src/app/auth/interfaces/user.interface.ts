export interface User {
  username: string;
  password: string;
}

export interface UserService {
  token: string;
  user: User;
  message: string;
  CodeResult: string;
}
