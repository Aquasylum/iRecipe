import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RecipeDisplayCardComponent } from './components/recipe-display-card/recipe-display-card.component';
import { RecipeComponent } from './components/recipe/recipe.component';
import { ViewRecipeComponent } from './components/view-recipe/view-recipe.component';
import { RecipeService } from './services/recipe.service';
import { ShareRecipeComponent } from './components/share-recipe/share-recipe.component';

@NgModule({
  declarations: [
    RecipeComponent,
    ViewRecipeComponent,
    RecipeDisplayCardComponent,
    ShareRecipeComponent,
  ],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  exports: [RecipeDisplayCardComponent],
  providers: [RecipeService],
})
export class RecipeModule {}
