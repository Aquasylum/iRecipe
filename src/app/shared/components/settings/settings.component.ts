import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'irecipe-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  currentColorTheme: string = 'dark';
  invertedColorTheme: string = 'light';
  displayName!: string | null | undefined;

  @Output() themeColor: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private settingsService: SettingsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.displayName = this.authService.getCurrentUserDisplayName();
  }

  changeColorTheme() {
    if (this.currentColorTheme == 'light') {
      this.currentColorTheme = 'dark';
      this.invertedColorTheme = 'light';
      this.settingsService.changeThemeToDark();
      this.themeColor.emit(this.currentColorTheme);
      return;
    }

    if (this.currentColorTheme == 'dark') {
      this.currentColorTheme = 'light';
      this.invertedColorTheme = 'dark';
      this.settingsService.changeThemeToLight();
      this.themeColor.emit(this.currentColorTheme);
      return;
    }
  }
}
