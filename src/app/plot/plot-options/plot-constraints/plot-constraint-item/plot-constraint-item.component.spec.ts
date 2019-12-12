import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotConstraintItemComponent } from './plot-constraint-item.component';

describe('PlotConstraintItemComponent', () => {
  let component: PlotConstraintItemComponent;
  let fixture: ComponentFixture<PlotConstraintItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlotConstraintItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotConstraintItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
