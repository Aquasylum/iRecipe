import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css'],
})
export class DiscoverComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.getCurrentUser())
      this.authService.emitCurrentLoggedInStatus(true);
  }
}
