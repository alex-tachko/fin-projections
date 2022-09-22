import {Point} from "../dtos/point.interface";

export abstract class InterpolationStrategy {
    public abstract getInterpolatedPoints(pointsToInterpolate: number[], knownPoints: Point[]): Point[];
}
