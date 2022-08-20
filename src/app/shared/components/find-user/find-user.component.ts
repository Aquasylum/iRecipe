import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { exhaustMap, Observable, takeLast } from 'rxjs';
import { UserService } from 'src/app/user/service/user.service';
import { UserDoesNotExist } from '../../validators/UserDoesNotExist.validator';

@Component({
  selector: 'irecipe-find-user',
  templateUrl: './find-user.component.html',
  styleUrls: ['./find-user.component.css'],
})
export class FindUserComponent implements OnInit {
  usernameControl!: FormControl;
  showSuccessMessage: boolean = false;
  inputText$!: Observable<string>;

  constructor(
    private userDoesNotExistValidator: UserDoesNotExist,
    private userService: UserService,
    private router: Router
  ) {
    //Allows the route to be reloaded and not reused
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.usernameControl = new FormControl(
      '',
      [],
      [
        this.userDoesNotExistValidator.validate.bind(
          this.userDoesNotExistValidator
        ),
      ]
    );

    this.usernameControl.valueChanges.subscribe(() =>
      setTimeout(() => this.resetUsernameForm(), 5000)
    );
  }

  resetUsernameForm() {
    this.usernameControl.reset();
  }

  async findUser() {
    let userId = await this.userService.getUserIdByUsername(
      this.usernameControl.value
    );
    this.usernameControl.reset();
    this.router.navigate(['/profile/' + userId]);
  }

  onCloseSuccessMessage() {
    this.showSuccessMessage = false;
    this.usernameControl.reset();
  }
}

// subscribe(() => {
//   console.log('x');
//   setTimeout(() => {
//     this.resetUsernameForm();
//   }, 10000);
// }
