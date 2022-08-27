import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, timer, of } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { SettingsService } from '../../services/settings.service';
import { UserDoesNotExist } from '../../validators/UserDoesNotExist.validator';

@Component({
  selector: 'irecipe-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  displayName!: string | null | undefined;
  isRecipes: boolean = true;
  userSearchControl!: FormControl;
  showSettings: boolean = false;
  showCollapsedSettings: boolean = false;
  showUserInput: boolean = true;
  colorTheme!: string;
  findUser: boolean = false;
  mobile!: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userDoesNotExistValidator: UserDoesNotExist,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.colorTheme = this.settingsService.getColorTheme();
    this.displayName = this.authService.getCurrentUser()?.displayName;
    this.initializeForm();

    if (window.innerWidth < 992) {
      this.mobile = true;
    } else if (window.innerWidth >= 992) this.mobile = false;
  }

  initializeForm() {
    this.userSearchControl = new FormControl(
      '',
      [],
      [
        this.userDoesNotExistValidator.validate.bind(
          this.userDoesNotExistValidator
        ),
      ]
    );
  }

  logout() {
    this.authService
      .logout()
      .then(() => this.router.navigate(['/login']))
      .catch((e) => console.log(e.message));
  }

  onRecipes() {
    this.isRecipes = true;
    this.router.navigate([
      '/profile/' + this.authService.getCurrentUser()?.uid,
    ]);
  }

  onDiscover() {
    this.isRecipes = false;
    this.router.navigate(['/discover']);
  }

  onColorTheme(themeColor: string) {
    this.colorTheme = themeColor;
  }

  toggleFindUserCollapsed() {
    this.findUser = !this.findUser;
  }

  onSettings() {
    this.router.navigate(['/settings']);
  }
}
