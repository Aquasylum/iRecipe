import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Recipe } from 'src/app/recipe/models/Recipe';
import { FileService } from 'src/app/user/service/file.service';
import { Comment } from '../../models/Comment';
import { RecipeService } from '../../services/recipe.service';

//Uuid
import * as uuid from 'uuid';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from 'src/app/user/service/user.service';

@Component({
  selector: 'irecipe-recipe-display-card',
  templateUrl: './recipe-display-card.component.html',
  styleUrls: ['./recipe-display-card.component.css'],
})
export class RecipeDisplayCardComponent implements OnInit, OnChanges {
  @Input() recipe!: Recipe;
  @Input() loggedInUserProfile!: boolean;
  @Input() isCarousel!: boolean;

  recipeImage!: string | undefined;
  comment: boolean = false;
  like!: boolean;
  userId!: string | undefined;
  isRecipeAuthor!: boolean;

  isFavorite!: boolean;

  constructor(
    private fileService: FileService,
    private recipeService: RecipeService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getCurrentUser()?.uid;
    this.recipe.authorId == this.userId
      ? (this.isRecipeAuthor = true)
      : (this.isRecipeAuthor = false);

    this.getRecipeImage();
    this.getLike();
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.getRecipeImage();
    this.changeImage(changes);
  }

  async getRecipeImage() {
    const newRecipeImage = await this.fileService.downloadRecipeImage(
      this.recipe.id
    );

    this.recipeImage = newRecipeImage;
  }

  getLike() {
    if (this.userId) {
      if (this.recipe.likedBy.indexOf(this.userId) == -1) {
        this.like = false;
      } else {
        this.like = true;
      }
    }
  }

  toggleComment() {
    this.comment = !this.comment;
  }

  toggleLike() {
    this.like = !this.like;

    if (
      this.like == true &&
      this.userId &&
      this.recipe.likedBy.indexOf(this.userId) == -1
    ) {
      {
        this.recipe.likedBy.push(this.userId);
        this.recipeService.updateLikedBy(this.recipe.id, this.userId);
      }
    }
    if (this.like == false && this.userId) {
      this.recipe.likedBy.splice(0, 1);
      this.recipeService.removeLikedBy(this.recipe.id, this.userId);
    }
  }

  async toggleFavorite() {
    this.isFavorite = !this.isFavorite;

    if (this.isFavorite == true) {
      //Add to this users recipe list
      this.userService.updateUserWithRecipeId(
        this.recipe.id,
        await this.userService.getUsername()
      );
    }

    if (this.isFavorite == false) {
      //Remove from this users recipe list
      this.userService.deleteRecipeFromUser(this.recipe.id);
    }
  }

  onAddComment(comment: Comment) {
    let commentObj = {
      username: comment.username,
      comment: comment.comment,
      commentId: uuid.v4(),
      dateCreated: Date.now(),
      commentAuthorId: this.authService.getCurrentUser()?.uid,
    };
    this.recipe.comments.push(commentObj);

    this.recipeService.updateRecipe(this.recipe);
  }

  onDeleteComment(comment: Comment) {
    this.recipeService.deleteCommentFromRecipe(comment, this.recipe.id);
  }

  changeImage(changes: SimpleChanges) {
    this.recipe = changes['recipe'].currentValue;
  }
}
