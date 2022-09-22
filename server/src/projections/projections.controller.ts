import {Body, Controller, HttpCode, Post, Query} from '@nestjs/common';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {ProjectionsService} from "./projections.service";
import {FinancialEntry} from "./dtos/financial-entry.dto";
import {LagrangeStrategy} from "./strategies/lagrange.strategy";
import {AlgorithmEnum} from "./enum/algorithm.enum";

@ApiTags('Financial Projections')
@Controller('projections')
export class ProjectionsController {
    constructor(private readonly service: ProjectionsService) {
    }

    @Post('interpolate')
    @HttpCode(200)
    @ApiOperation({description: 'Get interpolated values'})
    async calculateProjections(
        @Body() data: FinancialEntry[],
        @Query('algo') algo: AlgorithmEnum
    ): Promise<FinancialEntry[]> {
        data.forEach(entry => entry.date = new Date(entry.date));

        const strategyMap = {
            [AlgorithmEnum.LAGRANGE]: LagrangeStrategy,
        }

        const strategy = strategyMap[algo];

        return this.service.interpolate(new strategy(), data);
    }
}
