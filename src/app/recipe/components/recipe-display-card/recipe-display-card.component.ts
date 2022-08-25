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

@Component({
  selector: 'irecipe-recipe-display-card',
  templateUrl: './recipe-display-card.component.html',
  styleUrls: ['./recipe-display-card.component.css'],
})
export class RecipeDisplayCardComponent implements OnInit, OnChanges {
  @Input() recipe!: Recipe;

  recipeImage!: string | undefined;
  comment: boolean = false;
  like!: boolean;
  userId!: string | undefined;

  constructor(
    private fileService: FileService,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getCurrentUser()?.uid;

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

    if (this.like == true && this.userId) {
      this.recipe.likedBy.push(this.userId);
      this.recipeService.updateRecipe(this.recipe);
    }
    if (this.like == false) {
      this.recipe.likedBy.filter((item) => item != this.userId);
      this.recipeService.updateRecipe(this.recipe);
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
