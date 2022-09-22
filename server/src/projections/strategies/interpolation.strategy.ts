import {Point} from "../dtos/point.interface";

export abstract class InterpolationStrategy {
    public abstract getInterpolatedPoint(x: number, knownPoints: Point[]): Point;
}
