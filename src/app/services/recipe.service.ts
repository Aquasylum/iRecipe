import { Injectable } from '@angular/core';
import { Recipe } from '../models/Recipe';
import { environment } from './../../environments/environment.prod';

//Firestore imports
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, addDoc } from 'firebase/firestore';
import { Observable, of } from 'rxjs';
import { MealType } from '../enums/MealType';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  //creating fake data to create recipe cards:

  // Initialize Firebase
  //readonly app = initializeApp(environment.firebase);

  // Initialize Cloud Firestore and get a reference to the service
  //readonly db = getFirestore(this.app);

  items!: Observable<any[]>;

  recipes: Recipe[] = [
    {
      id: uniqueId(),
      name: 'Chicken Wrap',
      author: 'Hercules Strydom',
      imageSrc: './../../assets/images/chickenwrap.jpg',
      dateCreated: Date.now(),
      dateModified: Date.now(),
      ingredients: [
        {
          name: 'Chicken',
          weight: 200,
          metricUnit: 'grams',
        },
      ],
      steps: [{ step: 'Fry chicken and add vegetables to wrap' }],
      recipeType: [
        { type: MealType.LUNCH },
        {
          type: MealType.HEALTHY,
        },
      ],
      estimatedTime: 25,
      calories: 450,
      tips: [
        { tip: 'Put spice on the chicken' },
        { tip: 'Fry wraps in oil unitil crispy' },
        {
          tip: 'Add any other extra vegetables to keep the calories low',
        },
      ],
    },
    {
      id: uniqueId(),
      name: 'Beef burger',
      author: 'Hercules Strydom',
      imageSrc: './../../assets/images/beefburger.jpg',
      dateCreated: Date.now(),
      dateModified: Date.now(),
      ingredients: [
        {
          name: 'Lean beef mince',
          weight: 200,
          metricUnit: 'grams',
        },
      ],
      steps: [
        {
          step: 'Mix beef with seasoning and egg',
        },
        {
          step: 'Preheat oven to 200C',
        },
        {
          step: 'Fold mince into patties',
        },
        {
          step: 'Bake in oven for 9 minutes',
        },
      ],
      recipeType: [{ type: MealType.SUPPER }, { type: MealType.EASY }],
      estimatedTime: 30,
      calories: 369,
      tips: [
        { tip: 'Dont over cook the beef' },
        { tip: 'Always add extra sauce' },
        { tip: 'Put cheese on and bake for another minute' },
      ],
    },
  ];

  constructor() {
    //this.items = firestore.collection('items').valueChanges();
  }

  getRecipes(): Observable<Recipe[]> {
    return of(this.recipes);

    // this.firestore
    //   .collection('recipes')
    //   .doc(this.recipes[0].id)
    //   .set(JSON.parse(JSON.stringify(this.recipes[0])));
  }

  getRecipeById(id: string): Observable<Recipe> {
    let $recipe = this.recipes.find((r) => r.id == id) as Recipe;
    return of($recipe);
  }
}

var uniqueId = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substring(2, 9);
};
