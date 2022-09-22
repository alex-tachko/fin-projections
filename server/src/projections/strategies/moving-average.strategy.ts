import {InterpolationStrategy} from "./interpolation.strategy";
import {Point} from "../dtos/point.interface";

export class MovingAverageStrategy extends InterpolationStrategy {
    private monthToUseInAverage: number;
    private isWeighted: boolean;

    constructor(monthToUseInAverage: number, isWeighted = false) {
        super();
        this.monthToUseInAverage = monthToUseInAverage;
        this.isWeighted = isWeighted;
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
                    if (this.isWeighted) {
                        const weightSum = (1 + this.monthToUseInAverage) * this.monthToUseInAverage / 2;
                        movingAverage += averageValues[i] * (i - x + this.monthToUseInAverage + 1) / weightSum;
                    } else {
                        movingAverage += averageValues[i] / this.monthToUseInAverage;
                    }
                }
                averageValues[x] = movingAverage;
            }

            averagePoints.push({x, y: averageValues[x]});
        }

        return averagePoints;
    }
}
