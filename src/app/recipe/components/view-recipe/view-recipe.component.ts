import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from 'src/app/user/service/user.service';
import { Recipe } from 'src/app/recipe/models/Recipe';
import { RecipeService } from 'src/app/recipe/services/recipe.service';
import { UserDoesNotExist } from 'src/app/shared/validators/UserDoesNotExist.validator';
import { FileService } from 'src/app/user/service/file.service';
import { SettingsService } from 'src/app/shared/services/settings.service';
import { Comment } from '../../models/Comment';

//Uuid
import * as uuid from 'uuid';

@Component({
  selector: 'app-view-recipe',
  templateUrl: './view-recipe.component.html',
  styleUrls: ['./view-recipe.component.css'],
})
export class ViewRecipeComponent implements OnInit {
  recipe!: Recipe;
  recipeImage!: string | undefined;
  showSuccessMessage: boolean = false;
  usernameControl!: FormControl;
  currentColorTheme: string = 'dark';
  isFavorite: boolean = false;
  userIsAuthor!: boolean;
  recipeId!: string;
  comment!: string;
  like!: boolean;
  userId!: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private userService: UserService,
    private userDoesNotExistValidator: UserDoesNotExist,
    private authService: AuthService,
    private fileService: FileService,
    private settingService: SettingsService
  ) {}

  ngOnInit(): void {
    this.recipeId = this.route.snapshot.paramMap.get('id') as string;
    this.userId = this.authService.getCurrentUser()?.uid;

    if (this.authService.getCurrentUser())
      this.authService.emitCurrentLoggedInStatus(true);

    this.settingService.colorTheme$.subscribe((color) =>
      this.colorTheme(color)
    );

    this.initializeRecipe();
    this.initializeFormControl();
    this.initializeIsFavorite();
  }

  initializeRecipe() {
    this.recipeService.getRecipeById(this.recipeId).then((obs) =>
      obs.subscribe((recipe) => {
        this.recipe = recipe;
        this.fileService.downloadRecipeImage(this.recipe.id).then((url) => {
          this.recipeImage = url;

          //Check if the current user is the author of the recipe
          this.recipe.authorId == this.authService.getCurrentUser()?.uid
            ? (this.userIsAuthor = true)
            : (this.userIsAuthor = false);

          this.getLike();
        });
      })
    );
  }

  initializeFormControl() {
    this.usernameControl = new FormControl(
      '',
      [],
      [
        this.userDoesNotExistValidator.validate.bind(
          this.userDoesNotExistValidator
        ),
      ]
    );
  }

  async initializeIsFavorite() {
    //Get all current user recipes:
    let recipeIds = await this.userService.getUserRecipeIds(
      this.authService.getCurrentUser()?.uid
    );
    if (!recipeIds) return;
    if (recipeIds.indexOf(this.recipeId) == -1) {
      this.isFavorite = false;
    } else {
      this.isFavorite = true;
    }
  }

  colorTheme(color: string) {
    this.currentColorTheme = color;
  }

  deleteRecipe() {
    this.recipeService
      .deleteRecipe(this.recipe.id)
      .then(() =>
        this.router.navigate([
          '/profile/' + this.authService.getCurrentUser()?.uid,
        ])
      );
  }

  sendRecipe() {
    //check if user is typing in their display name ie owner cannot send recipe to self
    if (
      this.authService.getCurrentUser()?.displayName ==
      this.usernameControl.value
    ) {
      this.usernameControl?.setErrors({ cantUseOwnUsername: true });
      return;
    }

    this.userService
      .updateUserWithRecipeId(this.recipe.id, this.usernameControl?.value)
      .then(() => {
        this.usernameControl.reset;
        this.showSuccessMessage = true;
      });
  }

  onCloseSuccessMessage() {
    this.showSuccessMessage = false;
    this.usernameControl.reset();
  }

  async toggleFavorite() {
    this.isFavorite = !this.isFavorite;

    if (this.isFavorite == true) {
      //Add to this users recipe list
      this.userService.updateUserWithRecipeId(
        this.recipeId,
        await this.userService.getUsername()
      );
    }

    if (this.isFavorite == false) {
      //Remove from this users recipe list
      this.userService.deleteRecipeFromUser(this.recipeId);
    }
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

  toggleLike() {
    this.like = !this.like;

    if (this.like == true && this.userId) {
      this.recipe.likedBy.push(this.userId);
      this.recipeService
        .updateRecipe(this.recipe)
        .then(() => this.initializeRecipe());
    }
    if (this.like == false) {
      let userIdIndex = this.recipe.likedBy.findIndex(
        (elem) => elem == this.userId
      );
      this.recipe.likedBy.splice(userIdIndex, 1);

      this.recipeService
        .updateRecipe(this.recipe)
        .then(() => this.initializeRecipe());
    }
  }

  sendComment() {
    let user = this.authService.getCurrentUser();
    if (user) {
      let commentObj = {
        username: user.displayName,
        comment: this.comment,
        commentId: uuid.v4(),
        dateCreated: Date.now(),
        commentAuthorId: user.uid,
      };
      this.recipe.comments.push(commentObj);

      this.recipeService
        .updateRecipe(this.recipe)
        .then(() => this.initializeRecipe());
    }
    this.comment = '';
  }

  onDeleteComment(comment: Comment) {
    this.recipeService
      .deleteCommentFromRecipe(comment, this.recipe.id)
      .then(() => this.initializeRecipe());
  }
}
