import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from 'src/app/user/service/user.service';
import { Recipe } from 'src/app/recipe/models/Recipe';
import { RecipeService } from 'src/app/recipe/services/recipe.service';
import { UserDoesNotExist } from 'src/app/shared/validators/UserDoesNotExist.validator';
import { FileService } from 'src/app/user/service/file.service';
import { SettingsService } from 'src/app/shared/services/settings.service';

@Component({
  selector: 'app-view-recipe',
  templateUrl: './view-recipe.component.html',
  styleUrls: ['./view-recipe.component.css'],
})
export class ViewRecipeComponent implements OnInit {
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

  recipe!: Recipe;
  id = this.route.snapshot.paramMap.get('id') as string;
  recipeImage!: string | undefined;
  showSuccessMessage: boolean = false;
  usernameControl!: FormControl;
  currentColorTheme: string = 'dark';
  isFavorite: boolean = false;
  userIsAuthor!: boolean;

  ngOnInit(): void {
    if (this.authService.getCurrentUser())
      this.authService.emitCurrentLoggedInStatus(true);

    this.settingService.colorTheme$.subscribe((color) =>
      this.colorTheme(color)
    );

    this.recipeService.getRecipeById(this.id).then((obs) =>
      obs.subscribe((recipe) => {
        this.recipe = recipe;
        this.fileService.downloadRecipeImage(this.recipe.id).then((url) => {
          this.recipeImage = url;

          //Check if the current user is the author of the recipe
          this.recipe.authorId == this.authService.getCurrentUser()?.uid
            ? (this.userIsAuthor = true)
            : (this.userIsAuthor = false);
        });
      })
    );

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
    //check if user is typing in their display name ie cannot send recipe to self
    if (
      this.authService.getCurrentUserDisplayName() == this.usernameControl.value
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

  toggleRecipeFavorite() {
    this.isFavorite = !this.isFavorite;
  }
}
