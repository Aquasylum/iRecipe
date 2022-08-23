import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
//Routes
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from 'src/app/recipe/services/recipe.service';
import { Recipe } from 'src/app/recipe/models/Recipe';

//Uuid
import * as uuid from 'uuid';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ingredient } from 'src/app/recipe/models/Ingredient';

import { FileService } from 'src/app/user/service/file.service';
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
  recipeId!: string;
  recipeImage!: string | undefined;
  file!: File;
  fileUploaded: boolean = false;
  fileName!: string;

  ingredientIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private fb: FormBuilder,
    private router: Router,
    private fileService: FileService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.getCurrentUser())
      this.authService.emitCurrentLoggedInStatus(true);

    this.id = this.route.snapshot.paramMap.get('id') as string;

    this.initializeForm();
    this.initializeRecipe();
    this.initializeMode();
  }

  initializeForm() {
    this.recipeForm = this.fb.group({
      id: [''],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ],
      ],
      description: [''],
      ingredients: this.fb.array([], [Validators.required]),
      steps: this.fb.array([], [Validators.required]),
      calories: ['', Validators.pattern('^[0-9]*$')],
      tips: this.fb.array([]),
      estimatedTime: ['', Validators.pattern('^[0-9]*$')],
      tags: this.fb.array([]),
      rating: [''],
      portions: ['', Validators.pattern('^[0-9]*$')],
    });

    this.addIngredient();
    this.addStep();
    this.addTip();
  }

  initializeMode() {
    //Checking if in add mode:
    //If in add mode then we create our own unique uid and assign it to the
    //id of the recipe and
    if (this.isAddMode) {
      this.recipeId = uuid.v4();
      this.id = this.recipeId;
      this.recipeForm.patchValue({
        id: this.recipeId,
      });
    }
  }

  initializeRecipe() {
    this.isAddMode = !this.id;
    //Checking if in edit mode
    if (!this.isAddMode) {
      if (this.id) {
        this.recipeService.getRecipeById(this.id).then((observable) => {
          this.fileUploaded = true;
          this.fileService
            .downloadRecipeImage(this.id)
            .then((imageUrl) => (this.recipeImage = imageUrl));

          observable
            .pipe(
              tap((r: Recipe) => {
                r.ingredients.forEach((i: Ingredient) =>
                  this.ingredients.push(this.fb.group(i))
                ),
                  r.steps.forEach((s) => {
                    this.steps.push(this.fb.group(s));
                  });
                r.tips?.forEach((t) => this.tips.push(this.fb.group(t)));
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
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(20),
        ],
      ],
      weight: ['', Validators.required],
      metricUnit: ['', Validators.required],
    });

    this.ingredients.push(ingredientForm);
    this.ingredientIndex++;
  }

  getCurrentIngredient(index: number) {
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
      step: ['', Validators.required, Validators.min(10), Validators.max(22)],
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
      tip: ['', Validators.required],
    });
    this.tips.push(tipForm);
  }

  deleteTip(tipIndex: number): void {
    this.tips.removeAt(tipIndex);
  }

  async onSubmit(): Promise<void> {
    this.findInvalidControls(this.recipeForm);
    //this.findInvalidControls(this.ingredients);
    if (this.isAddMode) {
      await this.recipeService.createRecipe(this.recipeForm.value);
      this.router.navigate(['/view-recipe/' + this.id]);
    } else if (!this.isAddMode) {
      await this.recipeService.updateRecipe(this.recipeForm.value);
      this.router.navigate(['view-recipe/' + this.id]);
    }
  }

  deleteRecipe() {
    this.recipeService
      .deleteRecipe(this.id)
      .then(() => this.router.navigate(['/']));
  }

  onChange(event: any) {
    this.file = event.target.files[0];
    this.fileName = this.file.name;
  }

  onUpload() {
    this.fileService.uploadRecipeImage(this.file, this.id).then(() => {
      this.fileService.downloadRecipeImage(this.recipeId).then((imageUrl) => {
        this.recipeImage = imageUrl;
        this.fileUploaded = true;
      });
    });
  }

  onDeleteImage() {
    this.fileService
      .deleteRecipe(this.id)
      .then(() => (this.fileUploaded = false));
  }

  findInvalidControls(form: any) {
    const invalid = [];
    const controls = form.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    return invalid;
  }
}
