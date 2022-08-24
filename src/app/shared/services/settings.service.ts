import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  colorTheme$: EventEmitter<string> = new EventEmitter();
  profileLayout$: EventEmitter<string> = new EventEmitter();

  colorTheme: string = 'dark';
  profileLayout: string = 'grid';

  constructor() {}

  getColorTheme() {
    return this.colorTheme;
  }

  getProfileLayout() {
    return this.profileLayout;
  }

  changeThemeToDark() {
    this.colorTheme = 'dark';
    this.colorTheme$.emit('dark');
  }

  changeThemeToLight() {
    this.colorTheme = 'light';
    this.colorTheme$.emit('light');
  }

  changeLayoutToGrid() {
    this.profileLayout = 'grid';
    this.profileLayout$.emit('grid');
  }

  changeLayoutToCarousel() {
    this.profileLayout = 'carousel';
    this.profileLayout$.emit('carousel');
  }
}
