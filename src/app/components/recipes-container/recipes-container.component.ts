import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/models/Recipe';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'irecipe-recipes-container',
  templateUrl: './recipes-container.component.html',
  styleUrls: ['./recipes-container.component.css'],
})
export class RecipesContainerComponent implements OnInit {
  recipeSelection: Recipe[] = [];

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService
      .getRecipes()
      .subscribe((recipe) => (this.recipeSelection = recipe));
  }
}
