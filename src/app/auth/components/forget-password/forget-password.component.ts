import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'irecpie-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
})
export class ForgetPasswordComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  emailForm!: FormGroup;
  showSuccessMessage: boolean = false;

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email() {
    return this.emailForm.get('email');
  }

  sendForgotPasswordEmail() {
    this.authService
      .resetPassword(this.email?.value)
      .then(() => {
        this.showSuccessMessage = true;
      })
      .catch((e: HttpErrorResponse) => {
        if (e.message == 'Firebase: Error (auth/invalid-email).') {
          this.email?.setErrors({ invalidEmail: true });
        }
      });
  }

  onCloseSuccessMessage() {
    this.router.navigate(['/login']);
  }
}
