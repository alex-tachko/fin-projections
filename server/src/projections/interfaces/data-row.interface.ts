import { IDataCell } from './data-cell.interface';

export interface IDataRow {
    title: string;
    cells: IDataCell[];
    totalPreviousYear: number;
    totalCurrentYear: number;
}

export interface IParcedDataRow {
    title: string;
    cells: { date: Date; amount: number }[];
}
