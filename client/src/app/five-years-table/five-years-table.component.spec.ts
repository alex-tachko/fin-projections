import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiveYearsTableComponent } from './five-years-table.component';

describe('FiveYearsTableComponent', () => {
  let component: FiveYearsTableComponent;
  let fixture: ComponentFixture<FiveYearsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiveYearsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiveYearsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
