import {Injectable} from '@nestjs/common';
import {FinancialEntry} from "./dtos/financial-entry.dto";
import {normalizeData, revertNormalization} from "./helpers/normalize-data.helper";
import {InterpolationStrategy} from "./strategies/interpolation.strategy";

@Injectable()
export class ProjectionsService {
    public interpolate(strategy: InterpolationStrategy, sourceData: FinancialEntry[]): FinancialEntry[] {
        const data = sourceData.sort((entryA, entryB) => +entryA.date - +entryB.date);

        const points = normalizeData(data);
        const interpolatedPoints = [];

        let previousPointX = 0;
        for (let i = 0; i < points.length; i++) {
            while (previousPointX <= points[i].x) {
                interpolatedPoints.push(strategy.getInterpolatedPoint(previousPointX, points));
                previousPointX++;
            }
        }

        return revertNormalization(interpolatedPoints, data[0].date);
    }
}
