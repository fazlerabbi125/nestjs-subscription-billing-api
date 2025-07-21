import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsArray, Min } from 'class-validator';
import { BillingCycle } from '../../../generated/prisma';

export class CreatePlanDto {
    @ApiProperty({
        example: 'Premium Plan',
        description: 'The name of the plan',
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: 'Premium plan with advanced features',
        description: 'The description of the plan',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        example: 29.99,
        description: 'The price of the plan',
        minimum: 0,
    })
    @IsNumber()
    @Min(0)
    price: number;

    @ApiProperty({
        example: true,
        description: 'Whether the plan is active',
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @ApiProperty({
        example: 'MONTHLY',
        description: 'The billing cycle of the plan',
        enum: BillingCycle,
    })
    @IsEnum(BillingCycle)
    billingCycle: BillingCycle;

    @ApiProperty({
        example: ['Feature 1', 'Feature 2', 'Feature 3'],
        description: 'List of features included in the plan',
        isArray: true,
        type: String,
    })
    @IsArray()
    @IsString({ each: true })
    features: string[];
}
