import { Component, OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'irecipe-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.css'],
})
export class ProfileHeaderComponent implements OnInit {
  username: string = '';
  userRating: number = 0;
  userRatingArray: number[] = [];

  constructor(public userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserNameAndSurname().then((username) => {
      username ? (this.username = username?.toLowerCase()) : 'anonymous';
    });

    this.userRating = this.userService.getUserRating();
    this.userRatingArray = new Array(this.userRating);
  }
}
