import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../../user/service/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'irecipe-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  error!: HttpErrorResponse;
  success: boolean = false;

  ngOnInit(): void {}

  register(data: {
    email: string;
    password: string;
    username?: string;
    name: string;
    surname: string;
  }) {
    this.authService
      .register(data)
      .then(() => {
        if (data.username) {
          this.userService
            .addUser(data.username.toLowerCase(), data.name, data.surname)
            .then(() => {
              this.success = true;
            });
        }
      })
      .catch((e: HttpErrorResponse) => {
        this.error = e;
      });
  }

  loginWithGoogle(data: boolean) {
    if (data) {
      this.authService
        .loginWithGoogle()
        .then(() => this.router.navigate(['/profile']))
        .catch((e) => console.log(e.message));
    }
  }
}
