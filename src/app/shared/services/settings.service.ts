import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  colorTheme$: EventEmitter<string> = new EventEmitter();

  constructor() {}

  changeThemeToDark() {
    this.colorTheme$.emit('dark');
  }

  changeThemeToLight() {
    this.colorTheme$.emit('light');
  }
}
