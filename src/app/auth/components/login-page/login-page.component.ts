import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

import { Router } from '@angular/router';
import { ILoginData } from 'src/app/models/Interfaces/ILoginData';

@Component({
  selector: 'irecipe-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
  bool: boolean = true;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  login(data: { email: string; password: string }) {
    this.authService
      .login(data)
      .then(() => this.router.navigate(['/home']))
      .catch((e) => console.log(e.message));
  }
}
