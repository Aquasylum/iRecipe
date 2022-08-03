import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from 'src/app/models/Recipe';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-view-recipe',
  templateUrl: './view-recipe.component.html',
  styleUrls: ['./view-recipe.component.css'],
})
export class ViewRecipeComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) {}

  recipe!: Recipe;
  id = this.route.snapshot.paramMap.get('id') as string;

  ngOnInit(): void {
    this.recipeService.getRecipeById(this.id).subscribe((recipe) => {
      this.recipe = recipe;
    });
  }
}
