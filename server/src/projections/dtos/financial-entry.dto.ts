import {IsDate, IsNumber} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class FinancialEntry {
    @IsDate()
    @ApiProperty()
    date: Date;

    @IsNumber()
    @ApiProperty()
    amount: number;
}
