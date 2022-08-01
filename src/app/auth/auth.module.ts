import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthService } from './services/auth.service';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterPageComponent } from './components/register-page/register-page.component';

@NgModule({
  declarations: [LoginFormComponent, LoginPageComponent, RegisterPageComponent],
  imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule, FormsModule],
  providers: [AuthService],
})
export class AuthModule {}
