import { Component, OnInit, Input } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';

@Component({
  selector: 'app-plot-constraint-item',
  templateUrl: './plot-constraint-item.component.html',
  styleUrls: ['./plot-constraint-item.component.css']
})
export class PlotConstraintItemComponent implements OnInit {

  constructor() { }

  @Input() set item(item: any) {
    this.data = item;
    this.title = item.data_type
      ? item.data_type.oterm_name : item.value_type.oterm_name;

    if (item.typed_values) {
      this.dimensionVariables = [
        ...this.dimensionVariables, ...item.typed_values.map((value, idx) => {
          return {id: idx, text: value.value_type.oterm_name};
        })
      ];
    } else {
      this.isDataValue = true;
    }
  }

  @Input() index: string;

  title: string;
  data: any;
  selectedDimVar: any;

  isDataValue = false;
  dimensionVariables: Select2OptionData[] = [{id: '', text: ''}];
  dimVarOptions: Select2Options = {
    width: '100%',
    containerCssClass: 'select2-custom-container'
  };

  ngOnInit() {
  }

  setSelectedVar(event) {
    const index = parseInt(event.value, 10);
    this.selectedDimVar = this.data.typed_values[index];
  }

}
