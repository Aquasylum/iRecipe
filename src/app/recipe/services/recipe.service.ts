import { Injectable } from '@angular/core';
import { Recipe } from '../models/Recipe';
import { Observable } from 'rxjs';

//firebase imports:
import {
  collection,
  where,
  query,
  deleteDoc,
  doc,
  updateDoc,
} from '@firebase/firestore';

import { Firestore, docData, getDocs, setDoc } from '@angular/fire/firestore';
import { UserService } from '../../user/service/user.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor(
    private fireStore: Firestore,
    private authService: AuthService,
    private userService: UserService
  ) {}

  recipeCollection = collection(this.fireStore, 'recipes');

  async getRecipesByUserId(userId: string): Promise<Recipe[] | null> {
    let recipes: Recipe[] = [];
    const userRecipeIds = await this.userService.getUserRecipeIds(userId);

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
    console.log(id);
    const recipeDocumentReference = doc(this.recipeCollection, id);
    return docData(recipeDocumentReference) as Observable<Recipe>;
  }

  async createRecipe(recipe: Recipe) {
    //Add all data not done by user
    recipe.dateCreated = Date.now();
    recipe.dateModified = Date.now();
    recipe.authorId = this.authService.getCurrentUser()?.uid;

    this.userService
      .getUserNameAndSurname(recipe.authorId)
      .then((usernameAndSurname) => {
        recipe.author = usernameAndSurname;
        setDoc(doc(this.fireStore, 'recipes', recipe.id), recipe).then(() =>
          this.userService.updateUser(recipe.id)
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

  async findRecipeByFilter(filter: string) {
    let recipes!: Recipe[];
    let q = query(this.recipeCollection, where('name', '==', filter));

    await getDocs(q).then((doc) =>
      doc.forEach((recipe) => recipes.push(recipe.data() as Recipe))
    );

    return recipes;
  }
}
