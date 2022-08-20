import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingsService } from './services/settings.service';
import { SettingsComponent } from './components/settings/settings.component';
import { HeaderComponent } from './components/header/header.component';
import { UserModule } from '../user/user.module';
import { FindUserComponent } from './components/find-user/find-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [HeaderComponent, SettingsComponent, FindUserComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [HeaderComponent, FindUserComponent],
  providers: [SettingsService],
})
export class SharedModule {}
