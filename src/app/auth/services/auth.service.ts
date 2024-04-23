import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environments } from 'src/environments/environments';
import { User, UserService } from '../interfaces/user.interface';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl: string = environments.baseURL;
  private user?: User;

  constructor(private http: HttpClient) {}

  get currentUser(): User | undefined {
    if (!this.user) return undefined;
    return structuredClone(this.user);
  }

  login(user: User): Observable<UserService> {
    return this.http
      .post<UserService>(`${this.baseUrl}/users/login`, user)
      .pipe(
        tap((userService) => (this.user = userService.user)),
        tap((userService) => localStorage.setItem('token', userService.token))
      );
  }

  checkAuthentication(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) return of(false);
    else return of(true);
  }

  logout() {
    this.user = undefined;
    localStorage.clear();
  }
}
