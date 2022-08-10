import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

import { Router } from '@angular/router';

@Component({
  selector: 'irecipe-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  bool: boolean = true;
  error!: HttpErrorResponse;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  login(data: { email: string; password: string }) {
    this.authService
      .login(data)
      .then(() => this.router.navigate(['/main']))
      .catch((e) => (this.error = e));
  }

  loginWithGoogle(data: boolean) {
    if (data) {
      this.authService
        .loginWithGoogle()
        .then(() => this.router.navigate(['/main']))
        .catch((e) => console.log(e.message));
    }
  }
}
