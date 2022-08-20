import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { user } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'irecipe-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.css'],
})
export class ProfileHeaderComponent implements OnInit {
  @Input() userId!: string | undefined;
  @Input() loggedInUserProfile!: boolean;

  username: string = '';
  userRating: number = 0;
  userRatingArray: number[] = [];

  constructor(public userService: UserService) {}

  ngOnInit(): void {
    //Check if profile belongs to the logged in user
    if (this.userId)
      this.userService.getUserNameAndSurname(this.userId).then((username) => {
        username ? (this.username = username?.toLowerCase()) : 'anonymous';
      });

    this.userRating = this.userService.getUserRating();
    this.userRatingArray = new Array(this.userRating);
  }
}
