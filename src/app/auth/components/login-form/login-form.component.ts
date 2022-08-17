import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserExistsValidator } from '../../../shared/validators/UserExists.validator';

@Component({
  selector: 'irecipe-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit, OnChanges {
  @Input() formType!: string;
  @Input() showSuccessMessage: boolean = false;
  @Input() userError!: HttpErrorResponse;

  @Output() googleLogin = new EventEmitter();
  @Output() facebookLogin = new EventEmitter();
  @Output() userFormData = new EventEmitter<any>();

  userForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userExistsValidator: UserExistsValidator,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.userError?.message == 'Firebase: Error (auth/email-already-in-use).'
    ) {
      this.email?.setErrors({ emailAlreadyInUse: true });
    }

    if (this.userError?.message == 'Firebase: Error (auth/wrong-password).') {
      this.password?.setErrors({ wrongPassword: true });
    }

    if (this.userError?.message == 'Firebase: Error (auth/user-not-found).') {
      this.userForm?.setErrors({ userNotFound: true });
    }
  }

  ngOnInit(): void {
    if (this.formType == 'login') {
      this.userForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });
    }

    if (this.formType == 'register') {
      this.userForm = this.fb.group({
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(12),
          ],
          [this.userExistsValidator.validate.bind(this.userExistsValidator)],
        ],
        name: [
          '',
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(12),
        ],
        surname: [
          '',
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(12),
        ],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });
    }
  }

  get email() {
    return this.userForm.get('email');
  }

  get password() {
    return this.userForm.get('password');
  }

  get username() {
    return this.userForm.get('username');
  }

  get name() {
    return this.userForm.get('name');
  }

  get surname() {
    return this.userForm.get('surname');
  }

  onSubmit() {
    this.userFormData.emit(this.userForm.value);
  }

  onGoogleLogin() {
    this.googleLogin.emit();
  }

  onFacebookLogin() {
    this.facebookLogin.emit();
  }

  onCloseSuccessMessage() {
    this.showSuccessMessage = false;
    this.router.navigate(['/login']);
  }

  onForgetPassword() {
    this.router.navigate(['/forget-password']);
  }
}
