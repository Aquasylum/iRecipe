import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() commentToAdd: EventEmitter<Comment> = new EventEmitter();
  @Output() commentToDelete: EventEmitter<Comment> = new EventEmitter();

  @Input() comments!: Comment[];

  comment!: string;
  loggedInUserId!: string | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loggedInUserId = this.authService.getCurrentUser()?.uid;
  }

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

  deleteComment(comment: Comment) {
    this.commentToDelete.emit(comment);
    let commentToRemoveIndex = this.comments.indexOf(comment);
    this.comments.splice(commentToRemoveIndex, 1);
  }

  millisecondsToDateConverter(dateCreated: number) {
    let date = new Date(dateCreated).toUTCString();
    return date.substring(0, 22);
  }
}
