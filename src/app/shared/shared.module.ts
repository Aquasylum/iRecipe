import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingsService } from './services/settings.service';
import { SettingsComponent } from './components/settings/settings.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [HeaderComponent, SettingsComponent],
  imports: [CommonModule],
  exports: [HeaderComponent],
  providers: [SettingsService],
})
export class SharedModule {}
