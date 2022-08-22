import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Recipe } from 'src/app/recipe/models/Recipe';
import { RecipeService } from 'src/app/recipe/services/recipe.service';
import { SettingsService } from 'src/app/shared/services/settings.service';

@Component({
  selector: 'irecipe-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  allRecipes!: Recipe[];
  recipe!: Recipe;
  recipeIndex: number = 0;
  userId!: string | undefined;
  loggedInUserProfile!: boolean;
  isFavorite: boolean = false;
  profileLayout: string = 'grid';
  colorTheme: string = 'dark';

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private settingService: SettingsService
  ) {}

  ngOnInit(): void {
    if (this.authService.getCurrentUser())
      this.authService.emitCurrentLoggedInStatus(true);

    this.userId = this.route.snapshot.paramMap.get('id') as string;
    if (!this.userId) {
      this.userId = this.authService.getCurrentUser()?.uid;
    }

    this.settingService.profileLayout$.subscribe(
      (layout) => (this.profileLayout = layout)
    );

    this.settingService.colorTheme$.subscribe(
      (color) => (this.colorTheme = color)
    );

    //Check if this profile belongs to the signed in user:
    this.userId == this.authService.getCurrentUser()?.uid
      ? (this.loggedInUserProfile = true)
      : (this.loggedInUserProfile = false);

    if (this.userId) {
      this.recipeService.getRecipesByUserId(this.userId).then((recipes) => {
        if (recipes) {
          this.allRecipes = recipes;
          this.recipe = this.allRecipes[this.recipeIndex];
        }
      });
    }
  }

  nextRecipe() {
    this.recipeIndex++;
    if (this.recipeIndex == this.allRecipes?.length) this.recipeIndex = 0;

    if (this.allRecipes) this.recipe = this.allRecipes[this.recipeIndex];
  }

  previousRecipe() {
    this.recipeIndex--;
    if (this.recipeIndex < 0 && this.allRecipes) {
      this.recipeIndex = this.allRecipes?.length - 1;
      this.recipe = this.allRecipes[this.recipeIndex];
    }
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }

  async onFilterRecipes(filter: any) {
    console.log(filter);
    this.allRecipes = await this.recipeService.findRecipeByFilter(filter);
    console.log(this.allRecipes);
  }
}
