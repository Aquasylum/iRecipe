import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RecipeDisplayCardComponent } from '../recipe/components/recipe-display-card/recipe-display-card.component';

@NgModule({
  declarations: [RecipeDisplayCardComponent],
  imports: [CommonModule],
  exports: [RecipeDisplayCardComponent],
})
export class SharedModule {}
