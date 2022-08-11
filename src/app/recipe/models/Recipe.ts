import { Time } from '@angular/common';
import { RecipeType } from './RecipeType';
import { Step } from './Step';
import { Ingredient } from './Ingredient';
import { Tip } from './Tip';
import { User } from 'firebase/auth';

export class Recipe {
  id!: string;
  name!: string;
  description?: string;
  imageSrc?: string;
  dateCreated!: number;
  dateModified!: number;
  ingredients!: Ingredient[];
  steps!: Step[];
  tips?: Tip[];
  portions?: number;
  calories?: number;
  estimatedTime?: number;
  recipeType!: RecipeType[];
  tags?: string[];
  rating?: number;
}
