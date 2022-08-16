import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/recipe/models/Recipe';
import { RecipeService } from 'src/app/recipe/services/recipe.service';

@Component({
  selector: 'irecipe-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  allRecipes!: Recipe[];
  recipe!: Recipe;
  recipeIndex: number = 0;
  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.getAllRecipesByUserId().then((recipes) => {
      this.allRecipes = recipes;
      this.recipe = this.allRecipes[this.recipeIndex];
    });
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
}
