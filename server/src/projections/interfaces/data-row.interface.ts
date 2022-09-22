import {IDataCell} from "./data-cell.interface";

export interface IDataRow {
    title: string,
    cells: IDataCell[],
    totalPreviousYear: number,
    totalCurrentYear: number
}
