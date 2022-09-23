import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
import { monthlyColumns } from '../table-card/table-card.component';

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
  @Input() public fullData = false;

  public chartOptions: ChartOptions = <ChartOptions>{};

  constructor() {
    const options = <ChartOptions>{
      dataLabels: {
        enabled: false,
      },
      //
      //
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

    if (this.fullData) {
      // const categories = this.chartData.map((value))
      options.xaxis = {
        type: 'category',
        labels: {
          formatter: function (val) {
            return val;
          },
        },
      };
      options.chart = {
        height: 350,
        type: 'line',
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: 'zoom',
        },
      };
    } else {
      options.chart = {
        height: 350,
        type: 'line',
      };
      options.xaxis = {
        labels: {
          trim: false,
        },
        categories: monthlyColumns,
      };
    }
    this.chartOptions = options;
  }

  ngOnInit(): void {}
}
