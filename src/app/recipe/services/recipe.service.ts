import { Injectable } from '@angular/core';
import { Recipe } from '../models/Recipe';
import { Observable } from 'rxjs';

//firebase imports:
import {
  addDoc,
  collection,
  where,
  query,
  deleteDoc,
  doc,
  updateDoc,
} from '@firebase/firestore';

import { Firestore, docData, getDocs } from '@angular/fire/firestore';
import { AuthService } from '../../auth/services/auth.service';
import { UserService } from '../../user/service/user.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor(
    private fireStore: Firestore,

    private userService: UserService
  ) {}

  recipeCollection = collection(this.fireStore, 'recipes');

  async getAllRecipesByUserId(): Promise<Recipe[]> {
    let recipes: Recipe[] = [];

    this.userService.userRecipeIds().then((ids) => {
      if (ids) {
        ids.forEach((id) => {
          const q = query(this.recipeCollection, where('id', '==', id));
          getDocs(q).then((querySnapshot) =>
            querySnapshot.forEach((doc) => recipes.push(doc.data() as Recipe))
          );
        });
      }
    });

    return recipes;
  }

  async getRecipeById(id: string): Promise<Observable<Recipe>> {
    const recipeDocumentReference = doc(this.recipeCollection, id);
    return (await docData(recipeDocumentReference)) as Observable<Recipe>;
  }

  async createRecipe(recipe: Recipe) {
    recipe.dateCreated = Date.now();
    recipe.dateModified = Date.now();
    let newRecipe = await addDoc(this.recipeCollection, recipe);

    //Adding recipe to the recipe array in User collection:
    this.userService.updateUserWithRecipeId(newRecipe.id);

    //Adding id to document:
    recipe.id = newRecipe.id;
    const recipeDocumentReference = doc(this.recipeCollection, recipe.id);
    await updateDoc(recipeDocumentReference, { ...recipe });
    return newRecipe.id;
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
