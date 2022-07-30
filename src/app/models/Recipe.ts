import { Time } from '@angular/common';
import { RecipeType } from '../models/RecipeType';
import { Step } from './Step';
import { Ingredient } from './Ingredient';
import { Tip } from './Tip';

export class Recipe {
  id!: string;
  author!: string;
  name!: string;
  imageSrc?: string;
  dateCreated!: number;
  dateModified!: number;
  ingredients!: Ingredient[];
  steps!: Step[];
  tips?: Tip[];
  calories?: number;
  estimatedTime?: number;
  recipeType!: RecipeType[];
  tags?: string[];
}
