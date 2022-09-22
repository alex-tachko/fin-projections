import {FinancialEntry} from "./financial-entry.dto";
import {IsArray, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class InterpolatePayload {
    @IsString()
    @ApiProperty()
    title: string;

    @IsArray()
    @ApiProperty()
    data: FinancialEntry[]
}
