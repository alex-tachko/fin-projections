import { Component, OnInit } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { FileUploadService } from '../services/file-upload.service';

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

const monthlyColumns: string[] = [
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

@Component({
  selector: 'app-one-year-table',
  templateUrl: './one-year-table.component.html',
  styleUrls: ['./one-year-table.component.scss'],
})
export class OneYearTableComponent implements OnInit {
  public data$: Observable<any> = EMPTY;
  public displayedColumns: string[] = [];
  public freq_columns: string[] = [];

  constructor(private fileService: FileUploadService) {}

  ngOnInit() {
    this.data$ = this.fileService.getPredictedData$();
    this.freq_columns = this.fileService.isMonthlyFrequency()
      ? monthlyColumns
      : quarterlyColumns;
    this.displayedColumns = ['title', ...this.freq_columns, 'totals'];
  }
}
