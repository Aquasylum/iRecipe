import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './recipe/components/header/header.component';
import { RecipesContainerComponent } from './recipe/components/recipes-container/recipes-container.component';
import { RecipeDisplayCardComponent } from './recipe/components/recipe-display-card/recipe-display-card.component';

//Services
import { RecipeService } from './recipe/services/recipe.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { RecipeComponent } from './recipe/components/recipe/recipe.component';
import { MainComponent } from './recipe/components/main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ViewRecipeComponent } from './recipe/components/view-recipe/view-recipe.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { ProfileHeaderComponent } from './user/components/profile-header/profile-header.component';

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
  declarations: [
    AppComponent,
    HeaderComponent,
    RecipesContainerComponent,
    RecipeDisplayCardComponent,
    MainComponent,
    RecipeComponent,
    ViewRecipeComponent,
    ProfileHeaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    BrowserAnimationsModule,
  ],
  exports: [RouterModule, ReactiveFormsModule],
  providers: [RecipeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
