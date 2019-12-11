import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotConstraintsComponent } from './plot-constraints.component';

describe('PlotConstraintsComponent', () => {
  let component: PlotConstraintsComponent;
  let fixture: ComponentFixture<PlotConstraintsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlotConstraintsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlotConstraintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
