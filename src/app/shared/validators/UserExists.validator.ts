import { Injectable } from '@angular/core';

import { AbstractControl, AsyncValidator } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserService } from '../../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserExistsValidator implements AsyncValidator {
  constructor(private userService: UserService) {}

  async validate(
    control: AbstractControl
  ): Promise<
    { [key: string]: any } | Observable<{ [key: string]: any } | null> | null
  > {
    return await this.userService
      .userExists(control.value.toLowerCase())
      .then((user) => {
        return user ? { exists: true } : null;
      });
  }
}
