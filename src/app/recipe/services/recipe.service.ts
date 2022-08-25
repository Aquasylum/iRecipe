import { Injectable } from '@angular/core';
import { Recipe } from '../models/Recipe';
import { Comment } from '../models/Comment';
import { Observable } from 'rxjs';

//Uuid
import * as uuid from 'uuid';

//firebase imports:
import {
  collection,
  where,
  query,
  deleteDoc,
  doc,
  updateDoc,
} from '@firebase/firestore';

import {
  Firestore,
  docData,
  getDocs,
  setDoc,
  arrayRemove,
} from '@angular/fire/firestore';
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
    const recipeDocumentReference = doc(this.recipeCollection, id);
    return docData(recipeDocumentReference) as Observable<Recipe>;
  }

  async createRecipe(recipe: Recipe) {
    //Add all data not done by user
    recipe.dateCreated = Date.now();
    recipe.dateModified = Date.now();
    recipe.authorId = this.authService.getCurrentUser()?.uid;
    recipe.comments = [];
    recipe.likedBy = [];

    await this.userService
      .getUserNameAndSurname(recipe.authorId)
      .then((usernameAndSurname) => {
        recipe.author = usernameAndSurname;
        setDoc(doc(this.fireStore, 'recipes', recipe.id), recipe).then(() =>
          this.userService.updateUser(recipe.id)
        );
      });
  }

  async updateRecipe(recipe: Recipe) {
    const recipeDocumentReference = doc(this.recipeCollection, recipe.id);
    recipe.dateModified = Date.now();
    return await updateDoc(recipeDocumentReference, { ...recipe });
  }

  async deleteRecipe(id: string) {
    const recipeDocumentReference = doc(this.recipeCollection, id);

    return await deleteDoc(recipeDocumentReference);
  }

  async findRecipeByFilter(filter: string, userId: string | undefined) {
    let recipes: Recipe[] = [];
    let q = query(this.recipeCollection, where('name', '==', filter));

    let allUserRecipes = await this.userService.getUserRecipeIds(userId);

    await getDocs(q).then((doc) =>
      doc.forEach((recipe) => recipes.push(recipe.data() as Recipe))
    );

    //Checking if the recipe with the filter belongs to the profile being viewed
    if (!recipes) {
      return;
    }
    for (let i = 0; i < recipes.length; i++) {
      if (allUserRecipes.indexOf(recipes[i].id) == -1) {
        recipes.splice(i);
      }
    }
    return recipes;
  }

  async deleteCommentFromRecipe(comment: Comment, recipeId: string) {
    let recipeToRemoveCommentFrom = doc(this.recipeCollection, recipeId);

    return await updateDoc(recipeToRemoveCommentFrom, {
      comments: arrayRemove(comment),
    });
  }
}
