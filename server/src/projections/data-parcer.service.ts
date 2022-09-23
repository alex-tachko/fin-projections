import { Injectable } from '@nestjs/common';
import { IParcedDataRow } from './interfaces/data-row.interface';
import { FrequencyEnum } from './enum/algorithm.enum';

const monthsEnds = [
    '-01-01',
    '-02-01',
    '-03-01',
    '-04-01',
    '-05-01',
    '-06-01',
    '-07-01',
    '-08-01',
    '-09-01',
    '-10-01',
    '-11-01',
    '-12-01',
];

const quartersEnds = ['-03-01', '-06-01', '-09-01', '-12-01'];

@Injectable()
export class DataParcerService {
    private parsedData: IParcedDataRow[];

    public parseData(
        data: any,
        frequency: FrequencyEnum,
        year: string
    ): IParcedDataRow[] {
        const datesEnds =
            frequency === FrequencyEnum.MONTHLY ? monthsEnds : quartersEnds;
        const dates = datesEnds.map((dateEnd) => new Date(`${year}${dateEnd}`));
        const parsedData: IParcedDataRow[] = [];

        data.forEach((metric) => {
            const parsedObj: IParcedDataRow = { title: metric[0], cells: [] };

            for (let i = 1; i <= dates.length; i++) {
                parsedObj.cells[i - 1] = {
                    date: dates[i - 1],
                    amount: metric[i],
                };
            }
            parsedData.push(parsedObj);
        });

        this.parsedData = parsedData;

        return parsedData;
    }

    public getParcedData(): IParcedDataRow[] {
        return this.parsedData;
    }

    public clearParcedData(): void {
        this.parsedData = null;
    }
}
