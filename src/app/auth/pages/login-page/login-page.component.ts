import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { User } from '../../interfaces/user.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: [],
})
export class LoginPageComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

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
      if (!user.token) {
        this.showSnackbar(`${user.message}`);
        return;
      }
      this.router.navigate(['/']);
    });
  }

  showSnackbar(message: string): void {
    this.snackbar.open(message, 'done', {
      duration: 2500,
    });
  }
}
