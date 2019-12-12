import { Component, OnInit, Input } from '@angular/core';
import { Dimension, PlotBuilder } from 'src/app/shared/models/plot-builder';
import { ObjectMetadata } from 'src/app/shared/models/object-metadata';
import { PlotService } from 'src/app/shared/services/plot.service';

@Component({
  selector: 'app-plot-constraints',
  templateUrl: './plot-constraints.component.html',
  styleUrls: ['./plot-constraints.component.css']
})
export class PlotConstraintsComponent implements OnInit {

  unselectedValues: any[];
  @Input() metadata: ObjectMetadata;

  constructor(
    private plotService: PlotService
  ) { }

  ngOnInit() {

    const initUnselectedValues = this.plotService.getUnselectedValueList();
    this.updateUnselectedValues(initUnselectedValues);

    this.plotService.getUnselectedValues()
      .subscribe(values => {
        this.updateUnselectedValues(values);
      });
  }

  updateUnselectedValues(values) {
    this.unselectedValues = [...this.metadata.dim_context.filter(item => {
      return !values.includes(this.metadata.dim_context.indexOf(item).toString());
    })];
    if (values.includes('D')) {
      this.unselectedValues.push(this.metadata.typed_values[0]);
    }
  }

}
