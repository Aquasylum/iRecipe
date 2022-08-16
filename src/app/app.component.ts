import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnChanges {
  title = 'iRecipe';
  isLoggedIn: boolean = false;

  constructor(public authService: AuthService) {
    console.log(this.authService.getCurrentUser());
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changing');
  }
}
