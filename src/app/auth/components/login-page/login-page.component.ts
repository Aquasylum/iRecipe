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

  async login(data: { email: string; password: string }) {
    let user = await this.authService
      .loginWithEmailAndPassword(data)
      .catch((e) => (this.error = e));

    if (user) {
      this.router.navigate(['/profile/' + user.user.uid]);
    }
  }

  async loginWithGoogle() {
    let user = await this.authService
      .loginWithGoogle()
      .catch((e) => (this.error = e));

    if (user) {
      this.router.navigate(['/profile/' + user.user.uid]);
    }
  }

  async loginWithFacebook() {
    let user = await this.authService
      .loginWithFacebook()
      .catch((e) => console.log(e));

    if (user) {
      this.router.navigate(['/profile/' + user.user.uid]);
    }
  }
}
