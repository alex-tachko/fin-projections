import {InterpolationStrategy} from "./interpolation.strategy";
import {Point} from "../interfaces/point.interface";

// TODO Handle f''(x)

export class BestStrategy extends InterpolationStrategy {
    private calculateWeightedAverageDelta(knownPoints: Point[]): number {
        let weightSum = 0;
        let deltaSum = 0;

        for(let i = 1; i < knownPoints.length; i++) {
            const weight = Math.pow(i, 3/2);
            weightSum += weight;
            deltaSum += weight * (knownPoints[i].y - knownPoints[i - 1].y)
                / (knownPoints[i].x - knownPoints[i - 1].x);
        }

        return deltaSum / weightSum;
    }

    getInterpolatedPoints(pointsToInterpolate: number[], knownPoints: Point[]): Point[] {
        const interpolatedPoints: Point[] = [];

        let minDelta = 1e9;
        let maxDelta = -1e9;

        for (let i = 1; i < knownPoints.length; i++) {
            const delta = (knownPoints[i].y - knownPoints[i - 1].y)
                / (knownPoints[i].x - knownPoints[i - 1].x);
            minDelta = Math.min(minDelta, delta);
            maxDelta = Math.max(maxDelta, delta);
        }

        const averageDelta = this.calculateWeightedAverageDelta(knownPoints);

        const probabilityOfGoingUp = (averageDelta - Math.abs(minDelta) / 2)
            / (Math.abs(maxDelta) / 2 - Math.abs(minDelta) / 2);

        const knownValues = {};
        const interpolatedValues = {};

        knownPoints.forEach(point => knownValues[point.x] = point.y);

        for (let x = 0; x <= pointsToInterpolate[pointsToInterpolate.length - 1]; x++) {
            if (knownValues[x] !== undefined) {
                interpolatedValues[x] = knownValues[x];
            } else {
                const isUpMovement = Math.random() <= probabilityOfGoingUp;
                const nextDelta = Math.random() * (isUpMovement ? maxDelta : -minDelta);

                interpolatedValues[x] = interpolatedValues[x - 1] + nextDelta;
            }

            interpolatedPoints.push({x, y: interpolatedValues[x]});
        }

        return interpolatedPoints;
    }
}

