import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SectionListComponent } from './/components/section-list/section-list.component';
import { RecipesContainerComponent } from './components/recipes-container/recipes-container.component';
import { RecipeDisplayCardComponent } from './components/recipe-display-card/recipe-display-card.component';

//Services
import { RecipeService } from './services/recipe.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { RecipeComponent } from './components/recipe/recipe.component';
import { HomeComponent } from './components/home/home.component';
import { ViewRecipeComponent } from './components/view-recipe/view-recipe.component';
import { LoginComponent } from './components/login/login.component';

let routes: Routes = [
  {
    path: '',
    component: HomeComponent,
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
    path: 'view-recipe/:id',
    component: ViewRecipeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SectionListComponent,
    RecipesContainerComponent,
    RecipeDisplayCardComponent,
    HomeComponent,
    RecipeComponent,
    ViewRecipeComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
  exports: [RouterModule],
  providers: [RecipeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
