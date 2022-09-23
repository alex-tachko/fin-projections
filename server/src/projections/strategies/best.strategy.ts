import {InterpolationStrategy} from "./interpolation.strategy";
import {Point} from "../interfaces/point.interface";

export class BestStrategy extends InterpolationStrategy {
    private calculateFirstDerivative(knownPoints: Point[]): number {
        let weightSum = 0;
        let deltaSum = 0;

        for(let i = 1; i < knownPoints.length; i++) {
            const weight = Math.pow(i, 5/4);
            weightSum += weight;
            deltaSum += weight * (knownPoints[i].y - knownPoints[i - 1].y)
                / (knownPoints[i].x - knownPoints[i - 1].x);
        }

        return deltaSum / weightSum;
    }

    private calculateSecondDerivative(knownPoints: Point[]): number {
        let weightSum = 0;
        let deltaSum = 0;

        for(let i = 2; i < knownPoints.length; i++) {
            const delta1 = (knownPoints[i].y - knownPoints[i - 1].y)
                / (knownPoints[i].x - knownPoints[i - 1].x);
            const delta2 = (knownPoints[i - 1].y - knownPoints[i - 2].y)
                / (knownPoints[i - 1].x - knownPoints[i - 2].x);

            const weight = Math.pow(i, 5/4);

            weightSum += weight;
            deltaSum += weight * (delta1 - delta2);
        }

        return deltaSum / weightSum;
    }

    getInterpolatedPoints(pointsToInterpolate: number[], knownPoints: Point[]): Point[] {
        const interpolatedPoints: Point[] = [];

        // let minDelta = 1e9;
        // let maxDelta = -1e9;
        //
        // for (let i = 1; i < knownPoints.length; i++) {
        //     const delta = (knownPoints[i].y - knownPoints[i - 1].y)
        //         / (knownPoints[i].x - knownPoints[i - 1].x);
        //     minDelta = Math.min(minDelta, delta);
        //     maxDelta = Math.max(maxDelta, delta);
        // }

        const firstDerivative = this.calculateFirstDerivative(knownPoints);
        const secondDerivative = this.calculateSecondDerivative(knownPoints);
        let nextDelta = firstDerivative;

        // const probabilityOfGoingUp = (averageDelta - Math.abs(minDelta) / 2)
        //     / (Math.abs(maxDelta) / 2 - Math.abs(minDelta) / 2);

        const knownValues = {};
        const interpolatedValues = {};

        knownPoints.forEach(point => knownValues[point.x] = point.y);

        for (let x = 0; x <= pointsToInterpolate[pointsToInterpolate.length - 1]; x++) {
            if (knownValues[x] !== undefined) {
                interpolatedValues[x] = knownValues[x];
            } else {
                // const isUpMovement = Math.random() <= probabilityOfGoingUp;
                // const nextDelta = Math.random() * (isUpMovement ? maxDelta : -minDelta);

                interpolatedValues[x] = interpolatedValues[x - 1] + nextDelta;
                nextDelta += secondDerivative;
            }

            interpolatedPoints.push({x, y: interpolatedValues[x]});
        }

        return interpolatedPoints;
    }
}

