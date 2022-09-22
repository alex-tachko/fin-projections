import {Point} from "../interfaces/point.interface";

export abstract class InterpolationStrategy {
    public abstract getInterpolatedPoints(pointsToInterpolate: number[], knownPoints: Point[]): Point[];
}
