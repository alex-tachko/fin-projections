import { Component, Input, OnInit } from '@angular/core';
import { FileUploadService, IDataRow } from '../services/file-upload.service';

export const monthlyColumns: string[] = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
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
  selector: 'app-table-card',
  templateUrl: './table-card.component.html',
  styleUrls: ['./table-card.component.scss'],
})
export class TableCardComponent implements OnInit {
  @Input() public data: IDataRow[] | null = [];

  public displayedColumns: string[] = [];
  public freq_columns: string[] = [];

  constructor(private fileService: FileUploadService) {}

  ngOnInit(): void {
    this.freq_columns = this.fileService.isMonthlyFrequency()
      ? monthlyColumns
      : quarterlyColumns;
    this.displayedColumns = ['title', ...this.freq_columns, 'totals'];
  }
}
