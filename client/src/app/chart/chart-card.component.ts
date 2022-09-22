import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { monthlyColumns } from '../one-year-table/one-year-table.component';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend,
  ChartComponent,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  tooltip: any; // ApexTooltip;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss'],
})
export class ChartCardComponent implements OnInit {
  @ViewChild('chart')
  chart!: ChartComponent;

  @Input() public chartData: ApexAxisChartSeries = <ApexAxisChartSeries>{};

  public chartOptions: ChartOptions = <ChartOptions>{};

  constructor() {
    this.chartOptions = <ChartOptions>{
      // series: [
      //   {
      //     name: 'Session Duration',
      //     data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
      //   },
      //   {
      //     name: 'Page Views',
      //     data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35],
      //   },
      //   {
      //     name: 'Total Visits',
      //     data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47],
      //   },
      // ],
      chart: {
        height: 350,
        type: 'line',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: 5,
        curve: 'straight',
        dashArray: [0, 8, 5],
      },
      title: {
        text: 'Projections',
        align: 'center',
      },
      legend: {
        tooltipHoverFormatter: function (val, opts) {
          return (
            val +
            ' - <strong>' +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            '</strong>'
          );
        },
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6,
        },
      },
      xaxis: {
        labels: {
          trim: false,
        },
        categories: monthlyColumns,
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val: any) {
                return val;
              },
            },
          },
          {
            title: {
              formatter: function (val: any) {
                return val;
              },
            },
          },
        ],
      },
      grid: {
        borderColor: '#f1f1f1',
      },
    };
  }

  ngOnInit(): void {}
}
