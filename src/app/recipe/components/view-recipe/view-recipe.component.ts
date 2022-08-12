import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from 'src/app/user/service/user.service';
import { Recipe } from 'src/app/recipe/models/Recipe';
import { RecipeService } from 'src/app/recipe/services/recipe.service';
import { UserDoesNotExist } from 'src/app/shared/validators/UserDoesNotExist.validator';
import { FileService } from 'src/app/user/service/file.service';

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
    private fb: FormBuilder,
    private userService: UserService,
    private userDoesNotExistValidator: UserDoesNotExist,
    private authService: AuthService,
    private fileService: FileService
  ) {}

  recipe!: Recipe;
  id = this.route.snapshot.paramMap.get('id') as string;
  usernameForm!: FormGroup;
  recipeImage!: string | undefined;
  showSuccessMessage: boolean = false;

  ngOnInit(): void {
    this.recipeService.getRecipeById(this.id).then((obs) =>
      obs.subscribe((recipe) => {
        this.recipe = recipe;
        this.fileService.downloadRecipeImage(this.recipe.id).then((url) => {
          this.recipeImage = url;
        });
      })
    );

    this.usernameForm = this.fb.group({
      username: [
        '',
        [],
        [
          this.userDoesNotExistValidator.validate.bind(
            this.userDoesNotExistValidator
          ),
        ],
      ],
    });
  }

  get username() {
    return this.usernameForm.get('username');
  }

  deleteRecipe() {
    this.recipeService
      .deleteRecipe(this.recipe.id)
      .then(() => this.router.navigate(['/main']));
  }

  sendRecipe() {
    //check if user is typing in their display name ie cannot send recipe to self
    if (this.authService.getCurrentUserDisplayName() == this.username?.value) {
      this.username?.setErrors({ cantUseOwnUsername: true });
      return;
    }

    this.userService
      .updateUserWithRecipeId(this.recipe.id, this.username?.value)
      .then(() => {
        this.usernameForm.reset;
        this.showSuccessMessage = true;
      });
  }

  onCloseSuccessMessage() {
    this.showSuccessMessage = false;
  }
}
