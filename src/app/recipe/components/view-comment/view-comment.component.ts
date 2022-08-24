import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Comment } from '../../models/Comment';

@Component({
  selector: 'irecipe-view-comment',
  templateUrl: './view-comment.component.html',
  styleUrls: ['./view-comment.component.css'],
})
export class ViewCommentComponent implements OnInit {
  @Output() commentToAdd: EventEmitter<Comment> = new EventEmitter();
  @Output() commentToDelete: EventEmitter<Comment> = new EventEmitter();

  @Input() comment!: Comment;
  loggedInUserId!: string | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loggedInUserId = this.authService.getCurrentUser()?.uid;
  }

  deleteComment(comment: Comment) {
    this.commentToDelete.emit(comment);
  }

  millisecondsToDateConverter(dateCreated: number) {
    let date = new Date(dateCreated).toUTCString();
    return date.substring(0, 25);
  }
}
