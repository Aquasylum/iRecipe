import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, Observable, interval } from 'rxjs';
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
  showSuccessMessage: boolean = false;
  username!: string;
  currentColorTheme: string = 'dark';
  userId!: string;
  userRatingArray: number[] = [];
  user!: User;

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
    this.settingService.colorTheme$.subscribe((color) =>
      this.colorTheme(color)
    );

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

  colorTheme(color: string) {
    this.currentColorTheme = color;
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
        this.showSuccessMessage = true;
        setTimeout(
          () => (this.showSuccessMessage = false),

          10000
        );

        this.userRatingArray = new Array(this.userService.getUserRating());
      });
    this.usernameControl.reset();
  }

  onCloseSuccessMessage() {
    this.router.navigate(['/profile/' + this.userId]);
    this.showSuccessMessage = false;
    this.usernameControl.reset();
  }
}
