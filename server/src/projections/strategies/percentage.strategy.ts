import {InterpolationStrategy} from "./interpolation.strategy";
import {Point} from "../interfaces/point.interface";

export class PercentageStrategy extends InterpolationStrategy {
    private percentage: number;

    constructor(percentage: number) {
        super();
        this.percentage = percentage;
    }

    getInterpolatedPoints(pointsToInterpolate: number[], knownPoints: Point[]): Point[] {
        const interpolatedPoints: Point[] = [];

        const knownValues = {};
        const interpolatedValues = {};

        knownPoints.forEach(point => knownValues[point.x] = point.y);

        for (let x = 0; x <= pointsToInterpolate[pointsToInterpolate.length - 1]; x++) {
            if (knownValues[x] !== undefined) {
                interpolatedValues[x] = knownValues[x];
            } else {
                interpolatedValues[x] = interpolatedValues[x - 12] * this.percentage / 100;
            }

            interpolatedPoints.push({x, y: interpolatedValues[x]});
        }

        return interpolatedPoints;
    }
}

