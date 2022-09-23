import {
    Body,
    Controller,
    Get,
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
import { IDataRow, IParcedDataRow } from './interfaces/data-row.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { read, utils } from 'xlsx';
import { FinancialEntry } from './dtos/financial-entry.dto';
import { MovingAverageStrategy } from './strategies/moving-average.strategy';
import { LinearStrategy } from './strategies/linear.strategy';
import { BestStrategy } from './strategies/best.strategy';
import { DataParcerService } from './data-parcer.service';

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
        @Query('percent') percent: string
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
        };

        const strategy = strategyMap[algo];

        const interpolatedMetrics =
            parsedData?.map(({ title, cells }) => {
                return this.projectionsService.getInterpolatedData(
                    strategy,
                    title,
                    cells
                );
            }) || [];

        return interpolatedMetrics;
    }
}
