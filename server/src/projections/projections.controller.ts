import {
    Body,
    Controller,
    Get,
    Header,
    HttpCode,
    Post,
    Query,
    Res,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectionsService } from './projections.service';
import { LagrangeStrategy } from './strategies/lagrange.strategy';
import { AlgorithmEnum, FrequencyEnum } from './enum/algorithm.enum';
import { InterpolatePayload } from './dtos/interpolate-request.dto';
import { IDataRow, IParcedDataRow } from './interfaces/data-row.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { read, utils, write, writeFile, writeFileXLSX } from 'xlsx';
import { FinancialEntry } from './dtos/financial-entry.dto';
import { MovingAverageStrategy } from './strategies/moving-average.strategy';
import { LinearStrategy } from './strategies/linear.strategy';
import { BestStrategy } from './strategies/best.strategy';
import { DataParcerService } from './data-parcer.service';
import { Readable } from 'stream';
import { PercentageStrategy } from './strategies/percentage.strategy';

@ApiTags('Financial Projections')
@Controller('projections')
export class ProjectionsController {
    constructor(
        private readonly projectionsService: ProjectionsService,
        private readonly dataParcerService: DataParcerService
    ) {}

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
            [AlgorithmEnum.BEST]: new BestStrategy(),
        };

        const strategy = strategyMap[algo];

        return this.projectionsService.getInterpolatedData(
            strategy,
            title,
            data
        );
    }

    @Post('parse-file')
    @HttpCode(200)
    @ApiOperation({ description: 'Get predicted values' })
    @UseInterceptors(FileInterceptor('excel'))
    parseFile(
        @UploadedFile() excel: Express.Multer.File
        // @Body('frequency') frequency: FrequencyEnum = FrequencyEnum.MONTHLY
    ) {
        const workbook = read(excel.buffer, {
            cellText: false,
            cellDates: true,
        });
        const data: string[][] = utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]],
            { header: 1 }
        );

        const parsedData = this.dataParcerService.parseData(data);

        // const year =
        //     excel.originalname.substr(0, excel.originalname.lastIndexOf('.')) ||
        //     excel.originalname;

        // const parsedData = this.dataParcerService.parseData(
        // data
        // frequency,
        // year
        // );

        return parsedData;
    }

    @Post('clear-data')
    @HttpCode(200)
    @ApiOperation({ description: 'Clear predicted values' })
    clearData() {
        this.dataParcerService.clearParcedData();
    }

    @Get('calculate-prediction')
    @HttpCode(200)
    @ApiOperation({ description: 'Get predicted values' })
    calculatePrediction(
        @Query('algo') algo: AlgorithmEnum,
        @Query('percent') percent: string,
        @Query('fullData') fullData: boolean
    ) {
        const parsedData = this.dataParcerService.getParcedData();

        const strategyMap = {
            [AlgorithmEnum.LAGRANGE]: new LagrangeStrategy(),
            [AlgorithmEnum.MA2]: new MovingAverageStrategy(2),
            [AlgorithmEnum.MA3]: new MovingAverageStrategy(3),
            [AlgorithmEnum.MA4]: new MovingAverageStrategy(4),
            [AlgorithmEnum.WEIGHTED_MA4]: new MovingAverageStrategy(4, true),
            [AlgorithmEnum.LINEAR]: new LinearStrategy(),
            [AlgorithmEnum.BEST]: new BestStrategy(),
            [AlgorithmEnum.PERCENTAGE]: new PercentageStrategy(+percent),
        };

        const strategy = strategyMap[algo];

        const interpolatedMetrics =
            parsedData?.map(({ title, cells }) => {
                return this.projectionsService.getInterpolatedData(
                    strategy,
                    title,
                    cells,
                    fullData
                );
            }) || [];

        return interpolatedMetrics;
    }

    @Get('download')
    @HttpCode(200)
    @ApiOperation({ description: 'Download predicted file' })
    @Header('Content-Type', 'text/xlsx')
    async downloadFile(
        @Res() res: Response,
        @Query('predictionType') predictionType: AlgorithmEnum,
        @Query('percent') percent: string,
        @Query('isTemplate') isTemplate: boolean
    ) {
        const interpolatedMetrics = this.calculatePrediction(
            predictionType,
            percent,
            false
        );

        const downloadData = interpolatedMetrics;

        // const wb = utils.book_new();

        // const sheet = utils.aoa_to_sheet(
        //     mapInterpolDataToDownload(interpolatedMetrics)
        // );
        // utils.book_append_sheet(wb, sheet, 'Sheet1');

        // return writeFile(wb, 'Predicted year');
        // console.log('\n\n sheet \n', sheet);
        // console.log('\n\n sheet \n', sheet);
        // const file = await writeFile(wb, 'Predicted_year2.xlsx');
        // console.log(file);
        // res.download(`${file}`);
        // res.download(`Predicted_year2.xlsx`);

        // const buffer = write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/octet-stream');

        // const dataArray = [{
        //   "id": 0,
        //   "species": "elk",
        //   "sex": "male"
        // },{
        //   "id": 1,
        //   "species": "moose",
        //   "sex": "female"
        // }];

        const wb = utils.book_new();
        // const ws = XLSX.utils.json_to_sheet(dataArray);
        const sheet = utils.aoa_to_sheet(
            mapInterpolDataToDownload(interpolatedMetrics)
        );
        utils.book_append_sheet(wb, sheet, 'TestWB.xlsx');

        const wbopts = {
            type: 'base64',
            bookType: 'xlsx',
            bookSST: false,
        } as any;

        const wbout = write(wb, wbopts);

        // console.log(wbout);

        res.send(wbout);
    }
}

const mapInterpolDataToDownload = (
    interpolatedMetrics: IDataRow[]
): string[][] => {
    const downloadData = [];
    const dates = ['', ...interpolatedMetrics[0].cells.map(({ date }) => date)];
    downloadData.push(dates);
    interpolatedMetrics.forEach((metric) => {
        const mappedAmounts = metric.cells.map((cell) => cell.currentAmount);
        downloadData.push([metric.title, ...mappedAmounts]);
    });
    return downloadData;
};
