import { Component } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { SettingsService } from './shared/services/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'iRecipe';
  isLoggedIn: boolean = false;
  currentColorTheme: string = 'dark';

  constructor(
    public authService: AuthService,
    private settingsService: SettingsService
  ) {
    this.authService.isLoggedIn$.subscribe((status) =>
      this.userLoggedInStatus(status)
    );

    this.settingsService.colorTheme$.subscribe((color) => {
      this.colorTheme(color);
    });
  }

  userLoggedInStatus(status: boolean) {
    this.isLoggedIn = status;
  }

  colorTheme(color: string) {
    this.currentColorTheme = color;
  }
}
