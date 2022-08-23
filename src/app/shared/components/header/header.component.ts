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
  findUser: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userDoesNotExistValidator: UserDoesNotExist
  ) {}

  ngOnInit(): void {
    this.displayName = this.authService.getCurrentUser()?.displayName;
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

  toggleSettings() {
    this.showSettings = !this.showSettings;
    if (this.showSettings == true) {
      setTimeout(() => this.toggleSettings(), 5000);
    }
  }

  onColorTheme(themeColor: string) {
    this.currentColorTheme = themeColor;
  }

  toggleFindUserCollapsed() {
    console.log(this.findUser);
    this.findUser = !this.findUser;
  }
}
