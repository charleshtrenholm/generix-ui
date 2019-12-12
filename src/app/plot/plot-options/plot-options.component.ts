import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { PlotService } from '../../shared/services/plot.service';
import { ObjectMetadata } from '../../shared/models/object-metadata';
import { QueryBuilderService } from '../../shared/services/query-builder.service';
import { Select2OptionData } from 'ng2-select2';
import { PlotBuilder, Dimension } from '../../shared/models/plot-builder';

@Component({
  selector: 'app-plot-options',
  templateUrl: './plot-options.component.html',
  styleUrls: ['./plot-options.component.css'],
})
export class PlotOptionsComponent implements OnInit {

  public metadata: ObjectMetadata;
  public plotTypeData: Array<Select2OptionData> = [{id: '', text: ''}];
  public plotTypeDataValue: string; // for select2
  public dimensionData: Array<Select2OptionData> = [];
  public listPlotTypes: any;
  public filteredPlotTypes: any;
  public selectedPlotType: any;
  public axisBlocks: any[];
  public objectId: string;
  public plotBuilder: PlotBuilder;
  public dimensions: Dimension[];
  public plotIcons = {};
  public previousUrl: string;
  public selectedNumberOfDimensions = 2;
  public constraintList = [];
  @Output() updated: EventEmitter<any> = new EventEmitter();
  currentUrl: string;
  isEditor = false; // determines whether component is in plot/options or plot/result

  public plotTypeOptions: Select2Options = {
    width: '100%',
    containerCssClass: 'select2-custom-container',
    templateResult: state => {
      if (!state.id) {
        return state;
      }
      return `${this.plotIcons[state.text]} <span>${state.text}</span>`;
    },
    escapeMarkup: m => m
  };

  numberOfDimensions: Select2OptionData[] = [
    {id: '2', text: '2'},
    {id: '3', text: '3'}
  ];

  constructor(
    private route: ActivatedRoute,
    private plotService: PlotService,
    private queryBuilder: QueryBuilderService,
    private router: Router,
    ) {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.currentUrl = event.url;
          this.isEditor = event.url.includes('result');
        }
      });
    }

  ngOnInit() {

    this.previousUrl = this.queryBuilder.getPreviousUrl();

    // set up plot builder value from service;
    this.plotBuilder = this.plotService.getPlotBuilder();

    // get object id
    this.route.params.subscribe(params => {
      this.objectId = params.id;
      this.plotBuilder.objectId = params.id;
    });

    // get metadata
    this.queryBuilder.getObjectMetadata(this.objectId)
      .subscribe((result: any) => {
        this.metadata = result;
        // this.selectedNumberOfDimensions = this.metadata.dim_context.length <= 1 ? 2 : 3;
        if (this.metadata.dim_context.length === 1) {
          this.selectedNumberOfDimensions = 1;
        } else {
          this.selectedNumberOfDimensions = 2;
        }

        // get list of plot types from server
        this.getPlotTypes();

        // set title and dimensions
        const plotType = this.plotService.getPlotType();
        if (!plotType) {
          this.setConfig(result);
        } else {
          // use old plot config (coming back from /result)
          this.plotTypeDataValue = plotType;
          this.dimensions = this.plotService.getConfiguredDimensions();
        }

        // get dropdown values for dimensions
        result.dim_context.forEach(dim => {
          this.dimensionData.push({
            id: this.dimensionData.length.toString(),
            text: dim.data_type.oterm_name
          });
        });

        // add dropdown value for data measurements
        this.dimensionData.push({
          // id: this.dimensionData.length.toString(),
          id: 'D',
          text: result.typed_values[0].value_type.oterm_name
        });
      });
  }

    test() {
    }

    setConfig(data) {
      this.plotService.setConfig(
        data.data_type.oterm_name,
        this.selectedNumberOfDimensions - 1,
        (dims: Dimension[]) => {
          this.dimensions = dims;
        }
      );
    }

    getPlotTypes() {
    this.plotService.getPlotTypes()
      .subscribe((data: any) => {
        this.listPlotTypes = data.results;

        // determines whether to show 2d or 3d plots based on number of dimensions dropdown or if its 1D
        this.filteredPlotTypes = data.results.filter(val => {
          return this.selectedNumberOfDimensions === 2
            ? val.n_dimensions === 1 : val.n_dimensions > 1;
        });

        // add plot type values to select2
        this.plotTypeData = [{id: '', text: ''}, ...this.filteredPlotTypes.map((val, idx) => {
          return { id: idx.toString(), text: val.name }; }
        )];

        // add icons for each plot type
        this.listPlotTypes.forEach(plotType => {
          this.plotIcons[plotType.name] = plotType.image_tag;
        });
      });
  }

  updatePlotType(event) {
    if (event.value.length) {
      const n = parseInt(event.value, 10);
      const { plotly_trace, plotly_layout, axis_blocks } = this.filteredPlotTypes[n];
      this.plotBuilder.plotly_trace = plotly_trace;
      this.plotBuilder.plotly_layout = plotly_layout;
      this.axisBlocks = axis_blocks;
      this.selectedPlotType = this.filteredPlotTypes[n];
      this.setConfig(this.metadata);
      this.plotService.setPlotType(event.value);
    }
  }

  submitPlot() {
    this.plotService.setPlotCache();
    if (this.isEditor) {
      this.updated.emit();
    } else {
      this.router.navigate([`plot/result/${this.objectId}`]);
    }
  }

  onGoBack(id) {

    this.plotService.clearPlotBuilder();
    const url = this.previousUrl ? this.previousUrl : `/search/result/brick/${id}`;
    this.router.navigate([url]);
  }

  updateNumberOfDimensions(event) {
    this.selectedNumberOfDimensions = parseInt(event.value, 10);
    this.getPlotTypes();
  }

  get needsConstraints() {
    /*
      plot needs constraints if there are more dimensions in brick than there are
      dimensions selected in dropdown. they don't need constraints if the brick is
      only one dimension as we will only display 1d plots for that.
    */
    return this.metadata.dim_context.length >= this.selectedNumberOfDimensions
      && this.metadata.dim_context.length !== 1;
  }

}
