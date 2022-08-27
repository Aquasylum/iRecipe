import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, Observable, interval, find } from 'rxjs';
import { User } from 'src/app/user/models/User';
import { UserService } from 'src/app/user/service/user.service';
import { SettingsService } from '../../services/settings.service';
import { UserDoesNotExist } from '../../validators/UserDoesNotExist.validator';

@Component({
  selector: 'irecipe-find-user',
  templateUrl: './find-user.component.html',
  styleUrls: ['./find-user.component.css'],
})
export class FindUserComponent implements OnInit {
  usernameControl!: FormControl;
  search: boolean = false;
  username!: string;
  colorTheme!: string;
  userId!: string;
  userRatingArray: number[] = [];
  user!: User;
  mobile!: boolean;
  userFound!: boolean;

  constructor(
    private userDoesNotExistValidator: UserDoesNotExist,
    private userService: UserService,
    private router: Router,
    private settingService: SettingsService
  ) {
    //Allows the route to be reloaded and not reused
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.colorTheme = this.settingService.getColorTheme();
    this.settingService.colorTheme$.subscribe((color) =>
      this.themeColor(color)
    );

    this.checkIsMobile();
    this.initializeForm();
  }

  checkIsMobile() {
    if (window.innerWidth < 992) {
      this.mobile = true;
    } else if (window.innerWidth >= 992) this.mobile = false;
  }

  initializeForm() {
    this.usernameControl = new FormControl(
      '',
      [],
      [
        this.userDoesNotExistValidator.validate.bind(
          this.userDoesNotExistValidator
        ),
      ]
    );

    this.usernameControl.valueChanges
      .pipe(
        switchMap(() => {
          return interval(10000);
        })
      )
      .subscribe(() => this.resetUsernameForm());
  }

  themeColor(color: string) {
    this.colorTheme = color;
  }

  resetUsernameForm() {
    this.usernameControl.reset();
  }

  async findUser() {
    this.username = this.usernameControl.value;
    await this.userService
      .getUserIdByUsername(this.usernameControl.value)
      .then((userId) => {
        this.userService
          .getUserByUsername(this.usernameControl.value)
          .then((user) => (this.user = user));
        this.userId = userId;
        this.userFound = true;
        setTimeout(
          () => (this.userFound = false),

          10000
        );

        this.userRatingArray = new Array(this.userService.getUserRating());
      });
    this.usernameControl.reset();
  }

  onUserFound() {
    this.router.navigate(['/profile/' + this.userId]);
    this.userFound = false;
    this.usernameControl.reset();
  }
}
