import { Component } from '@angular/core';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'iRecipe';
  isLoggedIn: boolean = false;

  constructor(public authService: AuthService) {
    this.authService.isLoggedIn$.subscribe((status) =>
      this.userLoggedInStatus(status)
    );
  }

  userLoggedInStatus(status: boolean) {
    this.isLoggedIn = status;
  }
}
