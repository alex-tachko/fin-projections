import { Component, OnInit } from '@angular/core';
import {
  AlgorithmEnum,
  FileUploadService,
  IDataRow,
} from '../services/file-upload.service';
import { ApexAxisChartSeries } from 'ng-apexcharts';
import { take } from 'rxjs';
import {
  AlgorithmsOptions,
  IMetricOption,
} from '../one-year-table/one-year-table.component';

@Component({
  selector: 'app-five-years',
  templateUrl: './five-years.component.html',
  styleUrls: ['./five-years.component.scss'],
})
export class FiveYearsComponent implements OnInit {
  public AlgorithmEnum = AlgorithmEnum;
  public predictionType = AlgorithmEnum.BEST;
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
    const params: { percent: string; fullData: boolean } = {
      percent:
        this.predictionType === AlgorithmEnum.PERCENT ? this.percent : '',
      fullData: true,
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
          data: selectedMetricData.cells.map((cell, index, array) => {
            const y = index > array.length - 13 ? cell.currentAmount : null;
            const date = new Date(cell.date);
            const x = `${date.getFullYear()}-${date.getMonth() + 1}`;
            return { x, y };
          }),
        },
        {
          name: 'Previous years',
          data: selectedMetricData.cells.map((cell, index, array) => {
            const y = index <= array.length - 13 ? cell.currentAmount : null;
            const date = new Date(cell.date);
            const x = `${date.getFullYear()}-${date.getMonth() + 1}`;
            return { x, y };
          }),
        },
      ];
      this.chartData = chartData;
      console.log('chartData');
    }
  }
}
