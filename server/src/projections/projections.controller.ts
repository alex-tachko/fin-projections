import {
    Body,
    Controller,
    HttpCode,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectionsService } from './projections.service';
import { LagrangeStrategy } from './strategies/lagrange.strategy';
import { AlgorithmEnum, FrequencyEnum } from './enum/algorithm.enum';
import { InterpolatePayload } from './dtos/interpolate-request.dto';
import { IDataRow } from './interfaces/data-row.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { read, utils } from 'xlsx';
import { FinancialEntry } from './dtos/financial-entry.dto';
import { MovingAverageStrategy } from './strategies/moving-average.strategy';
import { LinearStrategy } from './strategies/linear.strategy';

@ApiTags('Financial Projections')
@Controller('projections')
export class ProjectionsController {
    constructor(private readonly service: ProjectionsService) {}

    @Post('interpolate')
    @HttpCode(200)
    @ApiOperation({ description: 'Get interpolated values' })
    async calculateProjections(
        @Body() payload: InterpolatePayload,
        @Query('algo') algo: AlgorithmEnum
    ): Promise<IDataRow> {
        const { data, title } = payload;

        data.forEach((entry) => (entry.date = new Date(entry.date)));

        const strategyMap = {
            [AlgorithmEnum.LAGRANGE]: new LagrangeStrategy(),
            [AlgorithmEnum.MA2]: new MovingAverageStrategy(2),
            [AlgorithmEnum.MA3]: new MovingAverageStrategy(3),
            [AlgorithmEnum.MA4]: new MovingAverageStrategy(4),
            [AlgorithmEnum.WEIGHTED_MA4]: new MovingAverageStrategy(4, true),
            [AlgorithmEnum.LINEAR]: new LinearStrategy(),
        };

        const strategy = strategyMap[algo];

        return this.service.getInterpolatedData(strategy, title, data);
    }

    @Post('calculate-prediction')
    @HttpCode(200)
    @ApiOperation({ description: 'Get predicted values' })
    @UseInterceptors(FileInterceptor('excel'))
    uploadFile(
        @UploadedFile() excel: Express.Multer.File,
        @Body('algo') algo: AlgorithmEnum,
        @Body('frequency') frequency: FrequencyEnum = FrequencyEnum.MONTHLY
    ) {
        const workbook = read(excel.buffer);
        const data = utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]],
            { header: 1 }
        );

        const year2 =
            excel.originalname.substr(0, excel.originalname.lastIndexOf('.')) ||
            excel.originalname;
        const parsedData = parseData(data, frequency, year2);

        return parsedData;
    }
}

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

const parseData = (
    data: any,
    frequency: FrequencyEnum,
    year: string
): FinancialEntry[] => {
    const datesEnds =
        frequency === FrequencyEnum.MONTHLY ? monthsEnds : quartersEnds;
    const dates = datesEnds.map((dateEnd) => new Date(`${year}${dateEnd}`));
    const parsedData = [];

    data.forEach((metric) => {
        const parsedObj: Record<string, any> = { title: metric[0], cells: [] };
        for (let i = 1; i <= dates.length; i++) {
            parsedObj.cells[i - 1] = {
                date: dates[i - 1],
                amount: metric[i],
            };
        }
        parsedData.push(parsedObj);
    });

    return parsedData;
};
