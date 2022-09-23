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

// const quartersEnds = ['-03-01', '-06-01', '-09-01', '-12-01'];
function getTimestampzFromDate(date: Date): string {
    return new Date(date.getTime() + 1000 * 60 * -date.getTimezoneOffset())
        .toISOString()
        .replace('T', ' ')
        .replace('Z', '');
}

@Injectable()
export class DataParcerService {
    private parsedData: IParcedDataRow[];

    public parseData(
        data: string[][]
        // frequency = FrequencyEnum.MONTHLY,
        // year: string
    ): IParcedDataRow[] {
        // const datesEnds =
        // frequency === FrequencyEnum.MONTHLY ? monthsEnds : quartersEnds;
        // const dates = datesEnds.map((dateEnd) => new Date(`${year}${dateEnd}`));
        const dates = data[0].slice(1).map((date) => new Date(date));

        const parsedData: IParcedDataRow[] = data.slice(1).map((metric) => {
            const parsedObj: IParcedDataRow = { title: metric[0], cells: [] };

            for (let i = 1; i <= dates.length; i++) {
                parsedObj.cells[i - 1] = {
                    date: dates[i - 1],
                    amount: +metric[i],
                };
            }
            return parsedObj;
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
