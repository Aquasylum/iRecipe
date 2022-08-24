import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'irecipe-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  colorTheme!: string;
  invertedColorTheme: string = 'light';
  displayName!: string | null | undefined;
  profileLayout!: string;

  @Output() themeColor: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private settingsService: SettingsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.colorTheme = this.settingsService.getColorTheme();
    this.profileLayout = this.settingsService.getProfileLayout();
    this.displayName = this.authService.getCurrentUser()?.displayName;
  }

  changeColorTheme() {
    if (this.colorTheme == 'light') {
      this.colorTheme = 'dark';
      this.invertedColorTheme = 'light';
      this.settingsService.changeThemeToDark();
      this.themeColor.emit(this.colorTheme);
      return;
    }

    if (this.colorTheme == 'dark') {
      this.colorTheme = 'light';
      this.invertedColorTheme = 'dark';
      this.settingsService.changeThemeToLight();
      this.themeColor.emit(this.colorTheme);
      return;
    }
  }

  changeProfileLayout() {
    if (this.profileLayout == 'carousel') {
      this.profileLayout = 'grid';
      this.settingsService.changeLayoutToCarousel();
      return;
    }

    if (this.profileLayout == 'grid') {
      this.profileLayout = 'carousel';
      this.settingsService.changeLayoutToGrid();
      return;
    }
  }
}
