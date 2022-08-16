import { NgModule } from '@angular/core';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { RecipeComponent } from './recipe/components/recipe/recipe.component';
import { RecipesContainerComponent } from './recipe/components/recipes-container/recipes-container.component';
import { ViewRecipeComponent } from './recipe/components/view-recipe/view-recipe.component';
import { DiscoverComponent } from './user/components/discover/discover.component';
import { ProfileComponent } from './user/components/profile/profile.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/login']);
//...canActivate(redirectUnauthorizedToLogin)

let routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
  },
  {
    path: 'recipe',
    component: RecipeComponent,
  },
  {
    path: 'recipe/:id',
    component: RecipeComponent,
  },
  {
    path: 'recipe-list',
    component: RecipesContainerComponent,
  },
  {
    path: 'view-recipe/:id',
    component: ViewRecipeComponent,
  },
  {
    path: 'discover',
    component: DiscoverComponent,
  },
  { path: '', redirectTo: '/profile', pathMatch: 'full' },

  // {
  //   path: '**',
  //   redirectTo: '/profile',
  //   pathMatch: 'full',
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
