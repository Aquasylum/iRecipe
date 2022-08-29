import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from 'src/app/user/service/user.service';

import { SettingsService } from '../../services/settings.service';
import { UserExistsValidator } from '../../validators/UserExists.validator';

@Component({
  selector: 'irecipe-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  colorTheme!: string;
  invertedColorTheme: string = 'light';
  username!: string | undefined;
  profileLayout!: string;
  invertedProfileLayout!: string;
  grid!: boolean;
  dark!: boolean;
  nameControl!: FormControl;
  surnameControl!: FormControl;
  userId!: string | undefined;
  userName!: string;
  userSurname!: string;

  @Output() themeColor: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private settingsService: SettingsService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (this.authService.getCurrentUser())
      this.authService.emitCurrentLoggedInStatus(true);
    this.colorTheme = this.settingsService.getColorTheme();
    this.profileLayout = this.settingsService.getProfileLayout();
    this.grid = true;
    this.dark = true;
    this.invertedProfileLayout = 'carousel';
    this.userId = this.authService.getCurrentUser()?.uid;
    this.initializeUserData();
    this.initializeForms();
  }

  async initializeUserData() {
    this.username = await this.userService.getUsername();

    if (this.username) {
      let user = await this.userService.getUserByUsername(this.username);
      this.userName = user.name;
      this.userSurname = user.surname;
    }
  }

  initializeForms() {
    this.nameControl = new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(12),
    ]);

    this.surnameControl = new FormControl('', [
      Validators.minLength(2),
      Validators.maxLength(12),
    ]);
  }

  changeName() {
    if (this.username) {
      this.userService
        .updateExistingUserName(this.nameControl.value, this.username)
        .then(() => this.initializeUserData());
    }
    this.nameControl.reset();
  }

  changeSurname() {
    if (this.username) {
      this.userService
        .updateExistingUserSurname(this.surnameControl.value, this.username)
        .then(() => this.initializeUserData());
    }
    this.surnameControl.reset();
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
