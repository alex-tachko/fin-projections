import {InterpolationStrategy} from "./interpolation.strategy";
import {Point} from "../interfaces/point.interface";

export class LinearStrategy extends InterpolationStrategy {
    getInterpolatedPoints(pointsToInterpolate: number[], knownPoints: Point[]): Point[] {
        const interpolatedPoints: Point[] = [];

        const averageDelta = (knownPoints[knownPoints.length - 1].y - knownPoints[0].y)
            / (knownPoints[knownPoints.length - 1].x - knownPoints[0].x);

        const knownValues = {};
        const interpolatedValues = {};

        knownPoints.forEach(point => knownValues[point.x] = point.y);

        for (let x = 0; x <= pointsToInterpolate[pointsToInterpolate.length - 1]; x++) {
            if (knownValues[x] !== undefined) {
                interpolatedValues[x] = knownValues[x];
            } else {
                interpolatedValues[x] = interpolatedValues[x - 1] + 6 * averageDelta * (Math.random() - 1 / 3);
            }

            interpolatedPoints.push({x, y: interpolatedValues[x]});
        }

        return interpolatedPoints;
    }
}

