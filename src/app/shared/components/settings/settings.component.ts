import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'irecipe-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  @Input() isCollapsed: boolean = true;

  colorTheme!: string;
  invertedColorTheme: string = 'light';
  displayName!: string | null | undefined;
  profileLayout!: string;
  invertedProfileLayout!: string;
  grid!: boolean;
  dark!: boolean;

  @Output() themeColor: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private settingsService: SettingsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.getCurrentUser())
      this.authService.emitCurrentLoggedInStatus(true);
    this.colorTheme = this.settingsService.getColorTheme();
    this.profileLayout = this.settingsService.getProfileLayout();
    this.grid = true;
    this.dark = true;
    this.invertedProfileLayout = 'carousel';
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

  changeColorThemeCollapsed(color: string) {
    if (color == 'light') {
      this.dark = false;
      this.colorTheme = 'dark';
      this.invertedColorTheme = 'light';
      this.settingsService.changeThemeToLight();
      this.themeColor.emit(this.colorTheme);
      return;
    }

    if (color == 'dark') {
      this.dark = true;
      this.colorTheme = 'light';
      this.invertedColorTheme = 'dark';
      this.settingsService.changeThemeToDark();
      this.themeColor.emit(this.colorTheme);
      return;
    }
  }

  changeProfileLayout() {
    if (this.profileLayout == 'carousel') {
      this.profileLayout = 'grid';
      this.invertedProfileLayout = 'carousel';
      this.settingsService.changeLayoutToGrid();
      return;
    }

    if (this.profileLayout == 'grid') {
      this.profileLayout = 'carousel';
      this.invertedProfileLayout = 'grid';
      this.settingsService.changeLayoutToCarousel();
      return;
    }
  }

  changeProfileLayoutCollapsed(profileLayout: string) {
    if (profileLayout == 'carousel') {
      this.grid = false;
      this.profileLayout = 'grid';
      this.invertedProfileLayout = 'carousel';
      this.settingsService.changeLayoutToCarousel();
      return;
    }

    if (profileLayout == 'grid') {
      this.grid = true;
      this.profileLayout = 'carousel';
      this.invertedProfileLayout = 'grid';
      this.settingsService.changeLayoutToGrid();
      return;
    }
  }
}
