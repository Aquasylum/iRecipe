import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Comment } from '../../models/Comment';

//Uuid
import * as uuid from 'uuid';

@Component({
  selector: 'irecipe-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  comment!: string;
  @Output() commentToAdd: EventEmitter<Comment> = new EventEmitter();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  sendComment() {
    //Get information about logged in user as this is the only person able to create this comment
    let user = this.authService.getCurrentUser();
    if (user) {
      let comment = new Comment();

      comment.username = user.displayName;
      comment.commentAuthorId = user.uid;
      comment.dateCreated = Date.now();
      comment.comment = this.comment;
      comment.commentId = uuid.v4();

      this.commentToAdd.emit(comment);
    }
    this.comment = '';
  }
}
