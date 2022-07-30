import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeDisplayCardComponent } from './recipe-display-card.component';

describe('RecipeDisplayCardComponent', () => {
  let component: RecipeDisplayCardComponent;
  let fixture: ComponentFixture<RecipeDisplayCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeDisplayCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeDisplayCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
