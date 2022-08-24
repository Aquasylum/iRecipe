import { RecipeType } from './RecipeType';
import { Step } from './Step';
import { Ingredient } from './Ingredient';
import { Tip } from './Tip';
import { Comment } from '../models/Comment';

export class Recipe {
  id!: string;
  name!: string;
  description?: string;
  author?: string | undefined;
  authorId!: string | undefined;
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
  comments: Comment[] = [];
  likes!: number;
  likedBy!: string[];
}
