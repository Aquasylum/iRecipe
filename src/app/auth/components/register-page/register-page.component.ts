import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { emailVerified } from '@angular/fire/auth-guard';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'irecipe-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  error!: HttpErrorResponse;
  success: boolean = false;

  ngOnInit(): void {}

  register(data: { email: string; password: string; username?: string }) {
    this.authService
      .register(data)
      .then(() => {
        if (data.username) {
          this.userService
            .addUser(data.username)
            .then(() => (this.success = true));
        }
      })
      .catch((e: HttpErrorResponse) => {
        this.error = e;
      });
  }
}
