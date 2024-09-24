import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChosenDoctprComponent } from './chosen-doctpr.component';

describe('ChosenDoctprComponent', () => {
  let component: ChosenDoctprComponent;
  let fixture: ComponentFixture<ChosenDoctprComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChosenDoctprComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChosenDoctprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
