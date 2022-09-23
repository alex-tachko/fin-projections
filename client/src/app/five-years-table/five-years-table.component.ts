import { Component, Input, OnInit } from '@angular/core';
import { FileUploadService, IDataRow } from '../services/file-upload.service';

@Component({
  selector: 'app-five-years-table',
  templateUrl: './five-years-table.component.html',
  styleUrls: ['./five-years-table.component.scss'],
})
export class FiveYearsTableComponent implements OnInit {
  @Input() public data: IDataRow[] | null = [];

  public displayedColumns: string[] = [];
  public freq_columns: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.freq_columns = [
      '2016',
      '2017',
      '2018',
      '2019',
      '2020',
      '2021',
      '2022',
    ];

    this.displayedColumns = ['title', ...this.freq_columns];
  }
}
