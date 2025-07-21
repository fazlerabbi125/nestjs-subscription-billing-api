import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class SwitchSubscriptionDto {
    @ApiProperty({
        example: 2,
        description: 'The ID of the new plan to switch to',
    })
    @IsNumber()
    @IsPositive()
    newPlanId: number;
}
