import { Injectable } from '@angular/core';

import { AbstractControl, AsyncValidator } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { UserService } from '../../auth/services/user.service';

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
    return await this.userService.userExists(control.value).then((user) => {
      return user ? { exists: true } : null;
    });
  }
}
