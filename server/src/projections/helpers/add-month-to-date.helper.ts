import {addMonths} from 'date-fns';
import {zonedTimeToUtc} from 'date-fns-tz';

export const GMT_TIMEZOZNE = 'GMT';

export const addMonthsToDate = (date: Date, monthsToAddNumber: number): Date => {
    return addMonths(zonedTimeToUtc(date, GMT_TIMEZOZNE), monthsToAddNumber);
};
