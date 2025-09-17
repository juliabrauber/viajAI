import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripResultComponent } from './trip-result.component';

describe('TripResultComponent', () => {
  let component: TripResultComponent;
  let fixture: ComponentFixture<TripResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
