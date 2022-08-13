import { Component, OnInit } from '@angular/core';
import { Observable, tap, map } from 'rxjs';
//Routes
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from 'src/app/recipe/services/recipe.service';
import { Recipe } from 'src/app/recipe/models/Recipe';

//Uuid
import * as uuid from 'uuid';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ingredient } from 'src/app/recipe/models/Ingredient';

import { FileService } from 'src/app/user/service/file.service';

@Component({
  selector: 'irecipe-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
})
export class RecipeComponent implements OnInit {
  isAddMode!: boolean;
  id!: string;
  recipeForm!: FormGroup;
  recipeId!: string;
  recipeImage!: string | undefined;
  file!: File;
  fileUploaded: boolean = false;

  ingredientIndex: number = -1;
  ingredientName!: string;
  ingredientWeight!: string;
  ingredientMetricUnit!: string;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private fb: FormBuilder,
    private router: Router,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') as string;
    this.isAddMode = !this.id;

    this.recipeForm = this.fb.group({
      id: [''],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
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

    this.addIngredient();

    if (this.isAddMode) {
      this.recipeId = uuid.v4();
      this.recipeForm.patchValue({
        id: this.recipeId,
      });
    }

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
        this.ingredientName,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
        ],
      ],
      weight: [this.ingredientWeight, Validators.required],
      metricUnit: [this.ingredientMetricUnit, Validators.required],
    });

    this.ingredients.push(ingredientForm);
    this.ingredientIndex++;
    console.log(this.ingredients.controls);
  }

  getCurrentIngredient(index: number) {
    console.log(this.ingredients.controls[index].value);
    this.ingredientIndex == index;
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

  onChange(event: any) {
    this.file = event.target.files[0];
  }

  onUpload() {
    this.fileService.uploadRecipeImage(this.file, this.recipeId).then(() => {
      this.fileService.downloadRecipeImage(this.recipeId).then((imageUrl) => {
        this.recipeImage = imageUrl;
        this.fileUploaded = true;
      });
    });
  }

  onDeleteImage() {
    this.fileService
      .deleteRecipe(this.recipeId)
      .then(() => (this.fileUploaded = false));
  }
}
