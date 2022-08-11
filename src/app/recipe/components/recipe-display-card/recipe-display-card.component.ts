import { Component, Input, OnInit } from '@angular/core';
import { Recipe } from 'src/app/recipe/models/Recipe';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'irecipe-recipe-display-card',
  templateUrl: './recipe-display-card.component.html',
  styleUrls: ['./recipe-display-card.component.css'],
})
export class RecipeDisplayCardComponent implements OnInit {
  @Input() recipe!: Recipe;
  constructor() {}

  ifNoPhoto: string = '../../../assets/images/burger.jpg';

  ngOnInit(): void {}
}
