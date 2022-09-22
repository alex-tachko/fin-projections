import {FinancialEntry} from "../dtos/financial-entry.dto";
import {Point} from "../dtos/point.interface";
import {addMonthsToDate} from "./add-month-to-date.helper";

export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export const normalizeAmounts = (amounts: number[]): number[] => {
    // TODO Add normalization
    return amounts;
};

export const revertAmountNormalization = (amount: number) => {
    return amount;
}

export const normalizeDates = (dates: Date[]): number[] => {
    const minDate = dates[0];
    return dates.map(date => (date.getFullYear() - minDate.getFullYear()) * 12 + (date.getMonth() - minDate.getMonth()));
}

export const revertDateNormalization = (x: number, minDate: Date): Date => {
    return addMonthsToDate(minDate, x);
}

export const normalizeData = (data: FinancialEntry[]): Point[] => {
    const xCoordinates = normalizeDates(data.map(({date}) => date));
    const yCoordinates = normalizeAmounts(data.map(({amount}) => amount));
    return data.map((_, index) => {
        return {
            x: xCoordinates[index],
            y: yCoordinates[index]
        }
    });
};

export const revertNormalization = (points: Point[], minDate: Date): FinancialEntry[] => {
    return points.map(point => {
        return {
            date: revertDateNormalization(point.x, minDate),
            amount: revertAmountNormalization(point.y)
        }
    })
}
