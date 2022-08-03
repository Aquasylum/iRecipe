import { Injectable } from '@angular/core';
import { Recipe } from '../models/Recipe';
import { Observable, of, from, ObservedValuesFromArray } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { MealType } from 'src/app/enums/MealType';

//firebase imports:
import {
  DocumentData,
  addDoc,
  collection,
  where,
  query,
  deleteDoc,
  doc,
  updateDoc,
} from '@firebase/firestore';
import { initializeApp } from 'firebase/app';

import {
  Firestore,
  docData,
  getDocs,
  firestoreInstance$,
} from '@angular/fire/firestore';
import { AuthService } from '../auth/services/auth.service';
import { RecipeComponent } from '../components/recipe/recipe.component';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor(private fireStore: Firestore, private auth: AuthService) {}

  recipeCollection = collection(this.fireStore, 'recipes');

  async getAllRecipesByUserId(): Promise<Recipe[]> {
    let recipes: Recipe[] = [];
    const q = query(
      this.recipeCollection,
      where('userId', '==', this.auth.getCurrentUser()?.uid)
    );

    await getDocs(q).then((querySnapshot) =>
      querySnapshot.forEach((doc) => recipes.push(doc.data() as Recipe))
    );

    return recipes;
  }

  getRecipeById(id: string): Observable<Recipe> {
    const recipeDocumentReference = doc(this.recipeCollection, id);
    return docData(recipeDocumentReference) as Observable<Recipe>;
  }

  async createRecipe(recipe: Recipe) {
    recipe.userId = this.auth.getCurrentUser()?.uid;
    recipe.dateCreated = Date.now();
    recipe.dateModified = Date.now();
    let newDocument = await addDoc(this.recipeCollection, recipe);

    //Adding id to document:
    recipe.id = newDocument.id;
    const recipeDocumentReference = doc(this.recipeCollection, recipe.id);
    await updateDoc(recipeDocumentReference, { ...recipe });
    return newDocument.id;
  }

  async updateRecipe(recipe: Recipe, id: string) {
    const recipeDocumentReference = doc(this.recipeCollection, id);
    recipe.dateModified = Date.now();
    return await updateDoc(recipeDocumentReference, { ...recipe });
  }

  async deleteRecipe(id: string) {
    const recipeDocumentReference = doc(this.recipeCollection, id);

    return await deleteDoc(recipeDocumentReference);
  }
}
