import {Body, Controller, HttpCode, Post} from '@nestjs/common';
import {ApiOperation, ApiTags} from "@nestjs/swagger";
import {ProjectionsService} from "./projections.service";
import {FinancialEntry} from "./dtos/financial-entry.dto";
import {LagrangeStrategy} from "./strategies/lagrange.strategy";

@ApiTags('Financial Projections')
@Controller('projections')
export class ProjectionsController {
    constructor(private readonly service: ProjectionsService) {
    }

    @Post('interpolate-lagrange')
    @HttpCode(200)
    @ApiOperation({description: 'Get interpolated values using Lagrange polynomial'})
    async calculateProjections(@Body() data: FinancialEntry[]): Promise<FinancialEntry[]> {
        data.forEach(entry => entry.date = new Date(entry.date));
        return this.service.interpolate(new LagrangeStrategy(), data);
    }
}
