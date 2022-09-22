import { Component, OnInit } from '@angular/core';

const USER_DATA = [
{
	"date": "1997-01-01",
	"previousPeriodAmount": "80766690",
	"currentAmount": "67892295",
	"percentage": "90"
},
{
	"date": "1997-01-01",
	"previousPeriodAmount": "80766690",
	"currentAmount": "67892295",
	"percentage": "90"
},
{
	"date": "1997-01-01",
	"previousPeriodAmount": "80766690",
	"currentAmount": "67892295",
	"percentage": "90"
}
]

const COLUMNS_SCHEMA = [
  {
      key: "date",
      type: "date",
      label: "date"
  },
  {
      key: "previousPeriodAmount",
      type: "number",
      label: "previousPeriodAmount"
  },
  {
    key: "currentAmount",
    type: "number",
    label: "currentAmount"
  },
  {
      key: "percentage",
      type: "number",
      label: "percentage"
  },
]

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  dataSource = USER_DATA;
  columnsSchema: any = COLUMNS_SCHEMA;
}
