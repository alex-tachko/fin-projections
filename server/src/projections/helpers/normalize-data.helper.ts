import {FinancialEntry} from "../dtos/financial-entry.dto";
import {Point} from "../dtos/point.interface";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const normalizeAmounts = (amounts: number[]): number[] => {
    // TODO Add normalization
    return amounts;
};

const revertAmountNormalization = (amount: number) => {
    return amount;
}

const normalizeDates = (dates: Date[]): number[] => {
    const minDate = dates[0];
    return dates.map(date => Math.trunc((+date - +minDate) / ONE_DAY_MS));
}

const revertDateNormalization = (x: number, minDate: Date): Date => {
    return new Date(x * ONE_DAY_MS + +minDate);
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
