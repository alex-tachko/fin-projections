import {Body, Controller, HttpCode, Post, Query} from '@nestjs/common';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {ProjectionsService} from "./projections.service";
import {LagrangeStrategy} from "./strategies/lagrange.strategy";
import {AlgorithmEnum} from "./enum/algorithm.enum";
import {InterpolatePayload} from "./dtos/interpolate-request.dto";
import {IDataRow} from "./interfaces/data-row.interface";

@ApiTags('Financial Projections')
@Controller('projections')
export class ProjectionsController {
    constructor(private readonly service: ProjectionsService) {
    }

    @Post('interpolate')
    @HttpCode(200)
    @ApiOperation({description: 'Get interpolated values'})
    async calculateProjections(
        @Body() payload: InterpolatePayload,
        @Query('algo') algo: AlgorithmEnum
    ): Promise<IDataRow> {
        const { data, title } = payload;

        data.forEach(entry => entry.date = new Date(entry.date));

        const strategyMap = {
            [AlgorithmEnum.LAGRANGE]: LagrangeStrategy,
        }

        const strategy = strategyMap[algo];

        return this.service.getInterpolatedData(new strategy(), title, data);
    }
}
