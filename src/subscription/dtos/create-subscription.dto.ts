import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateSubscriptionDto {
    @ApiProperty({
        example: 1,
        description: 'The ID of the plan to subscribe to',
    })
    @IsNumber()
    @IsPositive()
    planId: number;
}
