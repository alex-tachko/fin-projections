import { Component, OnInit } from '@angular/core';
import { FileUploadService, IDataRow } from '../services/file-upload.service';
import { ApexAxisChartSeries } from 'ng-apexcharts';

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

export const monthlyColumns: string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Maj',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const quarterlyColumns: string[] = ['QTR 1', 'QTR 2', 'QTR 3', 'QTR 4'];

interface IMetricOption {
  title: string;
}

@Component({
  selector: 'app-one-year-table',
  templateUrl: './one-year-table.component.html',
  styleUrls: ['./one-year-table.component.scss'],
})
export class OneYearTableComponent implements OnInit {
  public data: IDataRow[] = [];
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

  public displayedColumns: string[] = [];
  public freq_columns: string[] = [];

  constructor(private fileService: FileUploadService) {}

  ngOnInit() {
    this.data = this.fileService.predictionData;
    this.metrics = this.data.map(({ title }) => ({ title }));
    this.selectedMetric = this.metrics[0]?.title;

    this.freq_columns = this.fileService.isMonthlyFrequency()
      ? monthlyColumns
      : quarterlyColumns;
    this.displayedColumns = ['title', ...this.freq_columns, 'totals'];
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
