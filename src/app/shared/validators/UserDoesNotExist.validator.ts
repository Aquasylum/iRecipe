import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserService } from '../../user/service/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserDoesNotExist implements AsyncValidator {
  constructor(private userService: UserService) {}

  async validate(
    control: AbstractControl
  ): Promise<
    { [key: string]: any } | Observable<{ [key: string]: any } | null> | null
  > {
    return await this.userService.userExists(control.value).then((user) => {
      return !user ? { doesNotExist: true } : null;
    });
  }
}
