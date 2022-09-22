import {Injectable} from '@nestjs/common';
import {FinancialEntry} from "./dtos/financial-entry.dto";
import {normalizeData, normalizeDates, revertNormalization} from "./helpers/normalize-data.helper";
import {InterpolationStrategy} from "./strategies/interpolation.strategy";
import {IDataRow} from "./interfaces/data-row.interface";
import {addMonthsToDate} from "./helpers/add-month-to-date.helper";
import {aggregateByMonth} from "./helpers/aggregate-by-month.helper";
import {
    getCurrentAmount,
    getPreviousAmount,
    getTotalCurrentYear,
    getTotalPreviousYear
} from "./helpers/calculation.helpers";

@Injectable()
export class ProjectionsService {
    public getInterpolatedData(strategy: InterpolationStrategy, title: string, data: FinancialEntry[]): IDataRow {
        const interpolatedData = this.interpolate(strategy, data);

        return {
            title,
            cells: interpolatedData.map(entry => {
                const date = entry.date;
                const currentAmount = getCurrentAmount(interpolatedData, entry);
                const previousAmount = getPreviousAmount(interpolatedData, entry);
                const percentage = +(currentAmount * 100 / previousAmount).toFixed(2);

                return {
                    date,
                    previousAmount,
                    currentAmount,
                    percentage,
                }
            }),
            totalCurrentYear: getTotalCurrentYear(interpolatedData),
            totalPreviousYear: getTotalPreviousYear(interpolatedData)
        }
    }

    private interpolate(strategy: InterpolationStrategy, sourceData: FinancialEntry[]): FinancialEntry[] {
        const data = sourceData.sort((entryA, entryB) => +entryA.date - +entryB.date);

        const aggregatedByMonthData: FinancialEntry[] = aggregateByMonth(data);

        const datesToPredict = aggregatedByMonthData.map(entry => entry.date);
        for (let i = 0; i < 12; i++) {
            datesToPredict.push(addMonthsToDate(datesToPredict[datesToPredict.length - 1], 1));
        }

        const normalizedDatesToPredict = normalizeDates(datesToPredict);

        const points = normalizeData(aggregatedByMonthData);
        const interpolatedPoints = [];

        normalizedDatesToPredict.forEach(x => interpolatedPoints.push(strategy.getInterpolatedPoint(x, points)));

        return revertNormalization(interpolatedPoints, data[0].date);
    }
}
