import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RecipeDisplayCardComponent } from '../recipe/components/recipe-display-card/recipe-display-card.component';
import { SettingsService } from './services/settings.service';
import { SettingsComponent } from './components/settings/settings.component';
import { HeaderComponent } from './components/header/header.component';

@NgModule({
  declarations: [
    RecipeDisplayCardComponent,
    HeaderComponent,
    SettingsComponent,
  ],
  imports: [CommonModule],
  exports: [RecipeDisplayCardComponent, HeaderComponent],
  providers: [SettingsService],
})
export class SharedModule {}
