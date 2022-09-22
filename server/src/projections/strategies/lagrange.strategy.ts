import {InterpolationStrategy} from "./interpolation.strategy";
import {Point} from "../interfaces/point.interface";

export class LagrangeStrategy extends InterpolationStrategy {
    private getInterpolatedPoint(x: number, knownPoints: Point[]): Point {
        let lagrange_pol = 0;
        let basics_pol: number;

        for (let i = 0; i < knownPoints.length; i++) {
            basics_pol = 1;
            for (let j = 0; j < knownPoints.length; j++) {
                if (j == i) {
                    continue;
                }
                basics_pol *= (x - knownPoints[j].x) / (knownPoints[i].x - knownPoints[j].x);
            }
            lagrange_pol += basics_pol * knownPoints[i].y;
        }
        return {
            x,
            y: Math.round(lagrange_pol),
        };
    }

    getInterpolatedPoints(pointsToInterpolate: number[], knownPoints: Point[]): Point[] {
        return pointsToInterpolate.map(x => this.getInterpolatedPoint(x, knownPoints));
    }
}
