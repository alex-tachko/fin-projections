import {addMonthsToDate} from "./add-month-to-date.helper";

export const subtractMonthsFromDate = (date: Date, monthsToSubtract: number): Date =>
    addMonthsToDate(date, -monthsToSubtract);
