import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: [],
})
export class LoginPageComponent {
  constructor(private authService: AuthService, private router: Router) {}

  private user: User = { username: '', password: '' };

  public usernameInput = new FormControl('');
  public passwordInput = new FormControl('');

  onChangeUsernameInput() {
    const value: string = this.usernameInput.value || '';
    this.user.username = value;
  }

  onChangePasswordInput() {
    const value: string = this.passwordInput.value || '';
    this.user.password = value;
  }

  onLogin(): void {
    this.authService.login(this.user).subscribe((user) => {
      this.router.navigate(['/']);
    });
  }
}
