import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrExaminationsComponent } from './dr-examinations.component';

describe('DrExaminationsComponent', () => {
  let component: DrExaminationsComponent;
  let fixture: ComponentFixture<DrExaminationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrExaminationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrExaminationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
