import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RecipeDisplayCardComponent } from './components/recipe-display-card/recipe-display-card.component';
import { RecipeComponent } from './components/recipe/recipe.component';
import { ViewRecipeComponent } from './components/view-recipe/view-recipe.component';
import { RecipeService } from './services/recipe.service';
import { FilterComponent } from './components/filter/filter.component';

@NgModule({
  declarations: [
    RecipeComponent,
    ViewRecipeComponent,
    RecipeDisplayCardComponent,
    FilterComponent,
  ],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  exports: [RecipeDisplayCardComponent, FilterComponent],
  providers: [RecipeService],
})
export class RecipeModule {}
