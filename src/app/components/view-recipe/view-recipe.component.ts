import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from 'src/app/models/Recipe';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'app-view-recipe',
  templateUrl: './view-recipe.component.html',
  styleUrls: ['./view-recipe.component.css'],
})
export class ViewRecipeComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  recipe!: Recipe;
  id = this.route.snapshot.paramMap.get('id') as string;
  ifNoPhoto: string = '../../../assets/images/empty.jpg';
  usernameForm!: FormGroup;

  ngOnInit(): void {
    this.recipeService.getRecipeById(this.id).then((obs) =>
      obs.subscribe((recipe) => {
        this.recipe = recipe;
      })
    );

    this.usernameForm = this.fb.group({
      username: [''],
    });
  }

  deleteRecipe() {
    this.recipeService
      .deleteRecipe(this.recipe.id)
      .then(() => this.router.navigate(['/main']));
  }

  sendRecipe() {
    console.log(this.usernameForm.value);
  }
}
