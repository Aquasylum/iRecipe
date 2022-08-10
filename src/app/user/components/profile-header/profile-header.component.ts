import { Component, OnInit } from '@angular/core';
import { user } from '@angular/fire/auth';
import { UserService } from '../../user.service';

@Component({
  selector: 'irecipe-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.css'],
})
export class ProfileHeaderComponent implements OnInit {
  username: string = '';
  userRating: number = 0;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserNameAndSurname().then((username) => {
      this.username = username;
    });

    this.userRating = this.userService.getUserRating();

    console.log(this.username);
  }
}
