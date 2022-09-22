import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneYearTableComponent } from './one-year-table.component';

describe('OneYearTableComponent', () => {
  let component: OneYearTableComponent;
  let fixture: ComponentFixture<OneYearTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneYearTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OneYearTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
