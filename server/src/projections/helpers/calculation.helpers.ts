import {FinancialEntry} from "../dtos/financial-entry.dto";
import {subtractMonthsFromDate} from "./subtract-month-from-date.helper";
import {ONE_DAY_MS} from "./normalize-data.helper";

export const getCurrentAmount = (data: FinancialEntry[], entry: FinancialEntry): number => {
    return entry.amount;
}

export const getPreviousAmount = (data: FinancialEntry[], entry: FinancialEntry): number => {
    const date = subtractMonthsFromDate(entry.date, 12);
    const previousYearEntry = data.find(e => Math.abs(+e.date - +date) < ONE_DAY_MS);

    if (previousYearEntry) {
        return previousYearEntry.amount;
    }
}

export const getTotalCurrentYear = (data: FinancialEntry[]): number => {
    return data.slice(-12).reduce((sum, entry) => sum + entry.amount, 0);
}

export const getTotalPreviousYear = (data: FinancialEntry[]): number => {
    return data.slice(0, Math.min(12, data.length - 12)).reduce((sum, entry) => sum + entry.amount, 0);
}
