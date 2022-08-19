import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareRecipeComponent } from './share-recipe.component';

describe('ShareRecipeComponent', () => {
  let component: ShareRecipeComponent;
  let fixture: ComponentFixture<ShareRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareRecipeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
