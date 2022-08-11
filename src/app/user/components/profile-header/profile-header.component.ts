import { Component, OnInit } from '@angular/core';
import { user } from '@angular/fire/auth';
import { UserService } from '../../user.service';

@Component({
  selector: 'irecipe-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.css'],
})
export class ProfileHeaderComponent implements OnInit {
  username: string | undefined = '';
  userRating: number = 0;
  userRatingArray: number[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserNameAndSurname().then((username) => {
      this.username = username?.toLowerCase();
    });

    this.userRating = this.userService.getUserRating();
    this.userRatingArray = new Array(this.userRating);
  }
}
