import { NgModule } from '@angular/core';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './recipe/components/main/main.component';
import { RecipeComponent } from './recipe/components/recipe/recipe.component';
import { RecipesContainerComponent } from './recipe/components/recipes-container/recipes-container.component';
import { ViewRecipeComponent } from './recipe/components/view-recipe/view-recipe.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);

let routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
    children: [
      {
        path: '',
        component: RecipesContainerComponent,
      },
      {
        path: 'recipe',
        component: RecipeComponent,
      },
      {
        path: 'recipe-list',
        component: RecipesContainerComponent,
      },
      {
        path: 'recipe/:id',
        component: RecipeComponent,
      },
      {
        path: 'view-recipe/:id',
        component: ViewRecipeComponent,
      },
    ],
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
