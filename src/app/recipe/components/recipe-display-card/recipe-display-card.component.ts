import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from 'src/app/recipe/models/Recipe';
import { FileService } from 'src/app/user/service/file.service';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'irecipe-recipe-display-card',
  templateUrl: './recipe-display-card.component.html',
  styleUrls: ['./recipe-display-card.component.css'],
})
export class RecipeDisplayCardComponent implements OnInit {
  @Input() recipe!: Recipe;

  recipeImage!: string | undefined;

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.fileService
      .downloadRecipeImage(this.recipe.id)
      .then((imageUrl) => (this.recipeImage = imageUrl));
  }
}
