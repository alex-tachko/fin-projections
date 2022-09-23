import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiveYearsComponent } from './five-years.component';

describe('FiveYearsComponent', () => {
  let component: FiveYearsComponent;
  let fixture: ComponentFixture<FiveYearsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiveYearsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiveYearsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
