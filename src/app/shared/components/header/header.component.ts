import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
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
  currentColorTheme: string = 'dark';

  constructor(
    private authService: AuthService,
    private router: Router,
    private userDoesNotExistValidator: UserDoesNotExist
  ) {}

  ngOnInit(): void {
    this.displayName = this.authService.getCurrentUserDisplayName();
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
    this.router.navigate(['/']);
  }

  onDiscover() {
    this.isRecipes = false;
    this.router.navigate(['/discover']);
  }

  toggleSettings() {
    this.showSettings = !this.showSettings;
  }

  onColorTheme(themeColor: string) {
    console.log('chaning theme color');
    this.currentColorTheme = themeColor;
  }
}
