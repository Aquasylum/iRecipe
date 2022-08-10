import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesContainerComponent } from './recipes-container.component';

describe('RecipesContainerComponent', () => {
  let component: RecipesContainerComponent;
  let fixture: ComponentFixture<RecipesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipesContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
