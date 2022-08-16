import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserDoesNotExist } from '../../validators/UserDoesNotExist.validator';

@Component({
  selector: 'irecipe-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private userDoesNotExistValidator: UserDoesNotExist
  ) {}
  displayName!: string | null | undefined;
  isRecipes: boolean = true;
  userSearchControl!: FormControl;
  showUserInput: boolean = false;

  ngOnInit(): void {
    this.displayName = this.auth.getCurrentUserDisplayName();
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
    this.auth
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

  toggleSearchUserInput() {
    this.showUserInput = !this.showUserInput;
  }
}
