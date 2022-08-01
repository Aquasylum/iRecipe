import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';

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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthRoutingModule } from './auth/auth-routing.module';
import { ViewRecipeComponent } from './components/view-recipe/view-recipe.component';

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
