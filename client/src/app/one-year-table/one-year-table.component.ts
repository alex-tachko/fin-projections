import { Component, OnInit } from '@angular/core';

export interface cell {
  name: string;
  date: string;
  previousPeriodAmount: number;
  currentAmount: number;
  percentage: string;
}

export interface PeriodicElement {
  title: string;
  position: number;
  cells: cell[];
  totalLastYear: number;
  totalCurrentYear: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    title: 'test',
    cells: [
      {
        name: 'Jan',
        date: '2022-01-22',
        previousPeriodAmount: 1000,
        currentAmount: 1000,
        percentage: '20%',
      },
    ],
    totalLastYear: 100000,
    totalCurrentYear: 10000,
  },
  {
    position: 2,
    title: 'test',
    cells: [
      {
        name: 'Jan',
        date: '2022-01-22',
        previousPeriodAmount: 1000,
        currentAmount: 1000,
        percentage: '20%',
      },
    ],
    totalLastYear: 100000,
    totalCurrentYear: 10000,
  },
];

@Component({
  selector: 'app-one-year-table',
  templateUrl: './one-year-table.component.html',
  styleUrls: ['./one-year-table.component.scss'],
})
export class OneYearTableComponent {
  displayedColumns: string[] = [
    'cells',
    'title',
    'totalLastYear',
    'totalCurrentYear',
  ];
  innerDisplayedColumns: string[] = [
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
  columnName: string[] = [
    'Month:',
    'name',
    'date',
    'previousPeriodAmount',
    'currentAmount',
    'percentage',
  ];
  data = ELEMENT_DATA;
}
