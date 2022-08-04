import { Component, OnInit } from '@angular/core';
import { Observable, tap, map } from 'rxjs';
//Routes
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from 'src/app/services/recipe.service';
import { Recipe } from 'src/app/models/Recipe';

import {
  ControlContainer,
  Form,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Ingredient } from 'src/app/models/Ingredient';
import { MealType } from 'src/app/enums/MealType';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'irecipe-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
})
export class RecipeComponent implements OnInit {
  isAddMode!: boolean;
  id!: string;
  recipeForm!: FormGroup;
  ingredientsData!: any;
  recipeTypesArray = Object.values(MealType);
  ifNoPhoto: string = '../../../assets/images/emptyjpg';

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.isAddMode = !this.id;

    this.recipeForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(20),
        ],
      ],
      author: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ],
      ],
      ingredients: this.fb.array([], [Validators.required]),
      steps: this.fb.array([], [Validators.required]),
      recipeTypes: this.fb.array([]),
      calories: ['', Validators.pattern('^[0-9]*$')],
      tips: this.fb.array([]),
      estimatedTime: ['', Validators.pattern('^[0-9]*$')],
      tags: this.fb.array([]),
      rating: [''],
      portions: ['', Validators.pattern('^[0-9]*$')],
    });

    //Checking if in edit mode
    if (!this.isAddMode) {
      if (this.id) {
        this.recipeService.getRecipeById(this.id).then((observable) => {
          observable
            .pipe(
              tap((r: Recipe) => {
                r.ingredients.forEach((i: Ingredient) =>
                  this.ingredients.push(this.fb.group(i))
                ),
                  r.steps.forEach((s) => {
                    this.steps.push(this.fb.group(s));
                  });
                r.tips?.forEach((t) => this.tips.push(this.fb.group(t))),
                  r.recipeType?.forEach((rt) =>
                    this.recipeTypes.push(this.fb.group(rt))
                  );
              })
            )
            .subscribe((recipe) => {
              console.log(recipe);
              this.recipeForm.patchValue(recipe);
            });
        });
      }
    }
  }

  //Get individual form fields for validation:
  get name() {
    return this.recipeForm.get('name');
  }

  get author() {
    return this.recipeForm.get('author');
  }

  get calories() {
    return this.recipeForm.get('calories');
  }

  get portions() {
    return this.recipeForm.get('portions');
  }

  get estimatedTime() {
    return this.recipeForm.get('estimatedTime');
  }

  //Ingredients
  get ingredients() {
    return this.recipeForm.controls['ingredients'] as FormArray;
  }

  addIngredient() {
    const ingredientForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      weight: ['', Validators.required],
      metricUnit: ['', Validators.required],
    });
    this.ingredients.push(ingredientForm);
  }

  deleteIngredient(ingredientIndex: number) {
    this.ingredients.removeAt(ingredientIndex);
  }

  //Steps
  get steps() {
    return this.recipeForm.controls['steps'] as FormArray;
  }

  addStep() {
    const stepForm = this.fb.group({
      step: ['', Validators.required],
    });
    this.steps.push(stepForm);
  }

  deleteStep(stepIndex: number): void {
    this.steps.removeAt(stepIndex);
  }

  //Tips:
  get tips() {
    return this.recipeForm.controls['tips'] as FormArray;
  }

  //Add the current tip to the existing array of tips
  addTip() {
    const tipForm = this.fb.group({
      tip: [''],
    });
    this.tips.push(tipForm);
  }

  deleteTip(tipIndex: number): void {
    this.tips.removeAt(tipIndex);
  }

  //Recipe Types
  get recipeTypes() {
    return this.recipeForm.controls['recipeTypes'] as FormArray;
  }

  onSelectedRecipeType(recipeType: string) {
    const recipeTypeForm = this.fb.group({
      types: [recipeType],
    });
    this.recipeTypes.push(recipeTypeForm);
  }

  deleteRecipeType(recipeTypeIndex: number): void {
    this.recipeTypes.removeAt(recipeTypeIndex);
  }

  onSubmit(): void {
    console.log(this.recipeForm.value);
    if (this.isAddMode) {
      this.recipeService
        .createRecipe(this.recipeForm.value)
        .then((id) => this.router.navigate(['/main/view-recipe/' + id]));
    } else if (!this.isAddMode) {
      this.recipeService
        .updateRecipe(this.recipeForm.value, this.id)
        .then(() => this.router.navigate(['/main/view-recipe/' + this.id]));
    }
  }

  deleteRecipe() {
    this.recipeService
      .deleteRecipe(this.id)
      .then(() => this.router.navigate(['/main']));
  }
}