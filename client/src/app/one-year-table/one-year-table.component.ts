import { Component, OnInit } from '@angular/core';
import {
  AlgorithmEnum,
  FileUploadService,
  IDataRow,
} from '../services/file-upload.service';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import { take } from 'rxjs';

export interface ICell {
  date: string;
  previousPeriodAmount: number;
  currentAmount: number;
  percentage: string;
}

export interface IRow {
  title: string;
  cells: ICell[];
  totalLastYear: number;
  totalCurrentYear: number;
}

const AlgorithmsOptions = [
  { value: AlgorithmEnum.LAGRANGE, viewValue: AlgorithmEnum.LAGRANGE },
  { value: AlgorithmEnum.MA2, viewValue: AlgorithmEnum.MA2 },
  { value: AlgorithmEnum.MA3, viewValue: AlgorithmEnum.MA3 },
  { value: AlgorithmEnum.MA4, viewValue: AlgorithmEnum.MA4 },
  { value: AlgorithmEnum.WEIGHTED_MA4, viewValue: AlgorithmEnum.WEIGHTED_MA4 },
  { value: AlgorithmEnum.LINEAR, viewValue: AlgorithmEnum.LINEAR },
  { value: AlgorithmEnum.BEST, viewValue: AlgorithmEnum.BEST },
  { value: AlgorithmEnum.PERCENT, viewValue: AlgorithmEnum.PERCENT },
];

interface IMetricOption {
  title: string;
}

@Component({
  selector: 'app-one-year-table',
  templateUrl: './one-year-table.component.html',
  styleUrls: ['./one-year-table.component.scss'],
})
export class OneYearTableComponent implements OnInit {
  public AlgorithmEnum = AlgorithmEnum;
  public predictionType = AlgorithmEnum.MA3;
  public percent = '';
  public algos = AlgorithmsOptions;
  public isLoaded = false;

  public data!: IDataRow[];
  // public data$!: Observable<IDataRow[]>;
  public metrics: IMetricOption[] = [];
  public _selectedMetric: string = '';
  public get selectedMetric(): string {
    return this._selectedMetric;
  }
  public set selectedMetric(metric: string) {
    this._selectedMetric = metric;
    this.setChartData(metric);
  }

  public chartData: ApexAxisChartSeries = [];

  constructor(private fileService: FileUploadService) {}

  ngOnInit() {
    this.isLoaded = this.fileService.isLoaded;
    this.getData();
  }

  getData() {
    const params: { percent: string } = {
      percent:
        this.predictionType === AlgorithmEnum.PERCENT ? this.percent : '',
    };
    this.fileService
      .calculatePrediction(this.predictionType, params)
      .pipe(take(1))
      .subscribe((data) => {
        if (data?.length) {
          this.data = data;
          this.metrics = data.map(({ title }) => ({ title }));
          this.selectedMetric = this.metrics[0]?.title;
          this.isLoaded = true;
        }
      });
  }

  clearData() {
    this.fileService
      .clearData()
      .pipe(take(1))
      .subscribe(() => {
        this.data = [];
        this.metrics = [];
        this.selectedMetric = '';
        this.isLoaded = false;
      });
  }

  setChartData(metric: string): void {
    const selectedMetricData = this.fileService.predictionData.find(
      ({ title }) => title === metric
    );
    if (selectedMetricData) {
      const chartData = [
        {
          name: 'Predicted year',
          data: selectedMetricData.cells.map((cell) => cell.currentAmount),
        },
        {
          name: 'Previous year',
          data: selectedMetricData.cells.map((cell) => cell.previousAmount),
        },
      ];
      this.chartData = chartData;
    }
  }
}
