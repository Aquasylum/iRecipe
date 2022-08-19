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

import { Firestore, docData, getDocs, setDoc } from '@angular/fire/firestore';
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

  async getAllRecipesByUserId(): Promise<Recipe[] | null> {
    let recipes: Recipe[] = [];
    const userRecipeIds = await this.userService.userRecipeIds();

    if (!userRecipeIds) return null;

    const recipieQueries = userRecipeIds.map((recipeId) => {
      const q = query(this.recipeCollection, where('id', '==', recipeId));
      return getDocs(q);
    });

    await Promise.all(
      recipieQueries.map((recipe) =>
        recipe.then((querySnapshot) => {
          querySnapshot.docs.forEach((doc) =>
            recipes.push(doc.data() as Recipe)
          );
        })
      )
    );

    return recipes;
  }

  async getRecipeById(id: string): Promise<Observable<Recipe>> {
    const recipeDocumentReference = doc(this.recipeCollection, id);
    return docData(recipeDocumentReference) as Observable<Recipe>;
  }

  async createRecipe(recipe: Recipe) {
    //Add all data not done by user
    recipe.dateCreated = Date.now();
    recipe.dateModified = Date.now();
    recipe.authorId = recipe.id;

    this.userService.getUserNameAndSurname().then((usernameAndSurname) => {
      recipe.author = usernameAndSurname;
      setDoc(doc(this.fireStore, 'recipes', recipe.id), recipe).then(() =>
        this.userService.updateUserWithRecipeId(recipe.id)
      );
    });

    return recipe.id;
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
