import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/recipe/models/Recipe';
import { RecipeService } from 'src/app/recipe/services/recipe.service';

@Component({
  selector: 'irecipe-recipes-container',
  templateUrl: './recipes-container.component.html',
  styleUrls: ['./recipes-container.component.css'],
})
export class RecipesContainerComponent implements OnInit {
  recipeSelection: Recipe[] = [];
  selectedMenu!: string;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService
      .getAllRecipesByUserId()
      .then((recipes) => (this.recipeSelection = recipes));
  }

  onMenuSelect(selectBy: string) {
    this.selectedMenu = selectBy;
  }
}
