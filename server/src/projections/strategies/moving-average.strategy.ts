import {InterpolationStrategy} from "./interpolation.strategy";
import {Point} from "../dtos/point.interface";

export class MovingAverageStrategy extends InterpolationStrategy {
    private monthToUseInAverage: number;

    constructor(monthToUseInAverage: number) {
        super();
        this.monthToUseInAverage = monthToUseInAverage;
    }

    getInterpolatedPoints(pointsToInterpolate: number[], knownPoints: Point[]): Point[] {
        const averagePoints: Point[] = [];

        const knownValues = {};
        const averageValues = {};

        knownPoints.forEach(point => knownValues[point.x] = point.y);

        for (let x = 0; x <= pointsToInterpolate[pointsToInterpolate.length - 1]; x++) {
            if (knownValues[x] !== undefined) {
                averageValues[x] = knownValues[x];
            } else {
                let movingAverage = 0;
                for (let i = x - this.monthToUseInAverage; i < x; i++) {
                    movingAverage += averageValues[i] / this.monthToUseInAverage;
                }
                averageValues[x] = movingAverage;
            }

            averagePoints.push({x, y: averageValues[x]});
        }

        return averagePoints;
    }
}
