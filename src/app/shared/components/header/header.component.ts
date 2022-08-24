import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Settings } from 'http2';
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
  showUserInput: boolean = true;
  colorTheme!: string;
  findUser: boolean = false;

  @HostListener('window:resize', []) updateDays() {
    // lg (for laptops and desktops - screens equal to or greater than 1200px wide)
    // md (for small laptops - screens equal to or greater than 992px wide)
    // sm (for tablets - screens equal to or greater than 768px wide)
    // xs (for phones - screens less than 768px wide)
    // if (window.innerWidth >= 1200) {
    //   this.visibleDays = 7; // lg
    // } else if (window.innerWidth >= 992) {
    //   this.visibleDays = 6; //md
    // } else if (window.innerWidth >= 768) {
    //   this.visibleDays = 5; //sm
    // } else if (window.innerWidth < 768) {
    //   this.visibleDays = 3; //xs
    // }
  }

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

  toggleSettings(event: Event) {
    this.showSettings = !this.showSettings;

    if (this.showSettings == true) {
      of(event)
        .pipe(switchMap(() => timer(5000)))
        .subscribe(() => (this.showSettings = false));
    }
  }

  onColorTheme(themeColor: string) {
    this.colorTheme = themeColor;
  }

  toggleFindUserCollapsed() {
    this.findUser = !this.findUser;
  }
}
