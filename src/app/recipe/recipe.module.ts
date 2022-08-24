import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RecipeDisplayCardComponent } from './components/recipe-display-card/recipe-display-card.component';
import { RecipeComponent } from './components/recipe/recipe.component';
import { ViewRecipeComponent } from './components/view-recipe/view-recipe.component';
import { RecipeService } from './services/recipe.service';
import { FilterComponent } from './components/filter/filter.component';
import { CommentComponent } from './components/comment/comment.component';
import { ViewCommentComponent } from './components/view-comment/view-comment.component';

@NgModule({
  declarations: [
    RecipeComponent,
    ViewRecipeComponent,
    RecipeDisplayCardComponent,
    FilterComponent,
    CommentComponent,
    ViewCommentComponent,
  ],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  exports: [RecipeDisplayCardComponent, FilterComponent, CommentComponent],
  providers: [RecipeService],
})
export class RecipeModule {}
