import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { Recipe } from 'src/app/recipe/models/Recipe';
import { FileService } from 'src/app/user/service/file.service';

@Component({
  selector: 'irecipe-recipe-display-card',
  templateUrl: './recipe-display-card.component.html',
  styleUrls: ['./recipe-display-card.component.css'],
})
export class RecipeDisplayCardComponent implements OnInit, OnChanges {
  @Input() recipe!: Recipe;

  recipeImage!: string | undefined;

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.getRecipeImage();
  }

  async ngOnChanges(changes: SimpleChanges) {
    await this.getRecipeImage();
    this.changeImage(changes);
  }

  async getRecipeImage() {
    const newRecipeImage = await this.fileService.downloadRecipeImage(
      this.recipe.id
    );
    console.log('changing image');
    this.recipeImage = newRecipeImage;
  }

  changeImage(changes: SimpleChanges) {
    console.log('changing text');
    this.recipe = changes['recipe'].currentValue;
  }
}
