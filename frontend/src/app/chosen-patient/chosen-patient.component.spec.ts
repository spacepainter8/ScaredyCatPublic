import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChosenPatientComponent } from './chosen-patient.component';

describe('ChosenPatientComponent', () => {
  let component: ChosenPatientComponent;
  let fixture: ComponentFixture<ChosenPatientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChosenPatientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChosenPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
