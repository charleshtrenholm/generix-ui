import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Select2OptionData } from 'ng2-select2';
import { PlotService } from 'src/app/shared/services/plot.service';
import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs4';

@Component({
  selector: 'app-plot-constraint-item',
  templateUrl: './plot-constraint-item.component.html',
  styleUrls: ['./plot-constraint-item.component.css']
})
export class PlotConstraintItemComponent implements OnInit {

  constructor(
    private plotService: PlotService,
    private chRef: ChangeDetectorRef,
  ) { }

  @ViewChild('table') el: ElementRef;

  @Input() set item(item: any) {
    this.data = item;
    this.title = item.data_type.oterm_name;
  }

  @Input() index: string;

  title: string;
  data: any;
  dataTable: any;
  selectedDataTableIndex: number;
  filterType: string;
  customIndexValue: string;

  isDataValue = false;
  filterOptions: Select2OptionData[] = [
    {id: '', text: ''},
    {id: 'first', text: 'First Item'},
    {id: 'last', text: 'Last Item'},
    {id: 'custom_idx', text: 'Custom Index'},
    {id: 'custom_val', text: 'Custom Value'}
  ];
  options: Select2Options = {
    width: '100%',
    containerCssClass: 'select2-custom-container'
  };

  ngOnInit() {
  }

  setFilterType(event) {
    this.filterType = event.value;
    if (event.value === 'first') {
      this.plotService.setConstraints(this.index, 0);
    } else if (event.value === 'last') {
      this.plotService.setConstraints(this.index, this.data.size - 1);
    }
    if (event.value === 'custom_val') {
      const table: any = $(this.el.nativeElement);
      this.dataTable = table.DataTable();
      this.chRef.detectChanges();
    }
  }

  setCustomValueIndex(index: number) {
    this.plotService.setConstraints(this.index, index);
    this.selectedDataTableIndex = index;
  }

  setCustomIndex() {
    const newCustomIndex = parseInt(this.customIndexValue, 10);
    if (!isNaN(newCustomIndex)) {
      this.plotService.setConstraints(this.index, newCustomIndex);
    } else {
      // validation error: invalid value type
    }
  }

  // get isNumber() {
    // return this.selectedDimVar.values.scalar_type === 'int' || 'float';
  // }

}
