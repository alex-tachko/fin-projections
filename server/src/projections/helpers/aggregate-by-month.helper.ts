import {FinancialEntry} from "../dtos/financial-entry.dto";

export const aggregateByMonth = (data: FinancialEntry[]): FinancialEntry[] => {
    const aggregatedData = {};

    data.forEach(entry => {
        const year = entry.date.getFullYear();
        const month = entry.date.getMonth();

        if (!aggregatedData[year]) {
            aggregatedData[year] = {};
        }

        if (!aggregatedData[year][month]) {
            aggregatedData[year][month] = 0;
        }

        aggregatedData[year][month] += entry.amount;
    });

    const result: FinancialEntry[] = [];

    Object.keys(aggregatedData).forEach(year => {
        Object.keys(aggregatedData[year]).forEach(month => {
            result.push({
                amount: aggregatedData[year][month],
                date: new Date(+year, +month, 1),
            })
        });
    });

    return result;
};
