import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { RecipesContainerComponent } from './recipe/components/recipes-container/recipes-container.component';

//Services
import { RecipeService } from './recipe/services/recipe.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { RecipeComponent } from './recipe/components/recipe/recipe.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ViewRecipeComponent } from './recipe/components/view-recipe/view-recipe.component';
import { UserModule } from './user/user.module';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecipesContainerComponent,
    RecipeComponent,
    ViewRecipeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    UserModule,
    SharedModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    BrowserAnimationsModule,
  ],
  exports: [RouterModule, ReactiveFormsModule],
  providers: [RecipeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
