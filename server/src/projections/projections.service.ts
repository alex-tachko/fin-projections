import { Injectable } from '@nestjs/common';
import { FinancialEntry } from './dtos/financial-entry.dto';
import {
    normalizeData,
    normalizeDates,
    revertNormalization,
} from './helpers/normalize-data.helper';
import { InterpolationStrategy } from './strategies/interpolation.strategy';
import { IDataRow } from './interfaces/data-row.interface';
import { addMonthsToDate } from './helpers/add-month-to-date.helper';
import { aggregateByMonth } from './helpers/aggregate-by-month.helper';
import {
    getCurrentAmount,
    getPreviousAmount,
    getTotalCurrentYear,
    getTotalPreviousYear,
} from './helpers/calculation.helpers';

@Injectable()
export class ProjectionsService {
    public getInterpolatedData(
        strategy: InterpolationStrategy,
        title: string,
        data: FinancialEntry[],
        fullData = false
    ): IDataRow {
        const interpolatedData = this.interpolate(strategy, data);
        const slicedData = fullData
            ? interpolatedData
            : interpolatedData.slice(-12);

        return {
            title,
            cells: slicedData.map((entry) => {
                const date = entry.date;
                const currentAmount = +getCurrentAmount(
                    interpolatedData,
                    entry
                ).toFixed(1);
                const previousAm = getPreviousAmount(interpolatedData, entry);
                const previousAmount = previousAm ? +previousAm.toFixed(1) : 0;
                const percentage = previousAm
                    ? +((currentAmount * 100) / previousAmount - 100).toFixed(1)
                    : 100;

                return {
                    date,
                    previousAmount,
                    currentAmount,
                    percentage: this.formatPercentage(percentage),
                };
            }),
            totalCurrentYear: +getTotalCurrentYear(interpolatedData).toFixed(1),
            totalPreviousYear:
                +getTotalPreviousYear(interpolatedData).toFixed(1),
        };
    }

    private formatPercentage(percentage: number): string {
        return percentage > 0 ? `+${percentage}%` : `${percentage}%`;
    }

    private interpolate(
        strategy: InterpolationStrategy,
        sourceData: FinancialEntry[]
    ): FinancialEntry[] {
        const data = sourceData.sort(
            (entryA, entryB) => +entryA.date - +entryB.date
        );

        const aggregatedByMonthData: FinancialEntry[] = aggregateByMonth(data);

        const datesToPredict = aggregatedByMonthData.map((entry) => entry.date);
        for (let i = 0; i < 12; i++) {
            datesToPredict.push(
                addMonthsToDate(datesToPredict[datesToPredict.length - 1], 1)
            );
        }

        const normalizedDatesToPredict = normalizeDates(datesToPredict);

        const points = normalizeData(aggregatedByMonthData);
        const interpolatedPoints = strategy.getInterpolatedPoints(
            normalizedDatesToPredict,
            points
        );

        return revertNormalization(interpolatedPoints, data[0].date);
    }
}
