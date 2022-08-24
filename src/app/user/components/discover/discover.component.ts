import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SettingsService } from 'src/app/shared/services/settings.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css'],
})
export class DiscoverComponent implements OnInit {
  colorTheme!: string;

  constructor(
    private authService: AuthService,
    private settingService: SettingsService
  ) {}

  ngOnInit(): void {
    this.colorTheme = this.settingService.getColorTheme();

    if (this.authService.getCurrentUser())
      this.authService.emitCurrentLoggedInStatus(true);

    this.settingService.colorTheme$.subscribe(
      (color) => (this.colorTheme = color)
    );
  }
}
