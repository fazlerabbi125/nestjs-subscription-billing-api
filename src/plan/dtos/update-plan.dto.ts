import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsBoolean, IsEnum, IsArray, Min } from 'class-validator';
import { BillingCycle } from '../../../generated/prisma';

export class UpdatePlanDto {
    @ApiProperty({
        example: 'Premium Plan Updated',
        description: 'The name of the plan',
        required: false,
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        example: 'Updated premium plan with advanced features',
        description: 'The description of the plan',
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        example: 39.99,
        description: 'The price of the plan',
        minimum: 0,
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @ApiProperty({
        example: true,
        description: 'Whether the plan is active',
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @ApiProperty({
        example: 'YEARLY',
        description: 'The billing cycle of the plan',
        enum: BillingCycle,
        required: false,
    })
    @IsOptional()
    @IsEnum(BillingCycle)
    billingCycle?: BillingCycle;

    @ApiProperty({
        example: ['Feature 1', 'Feature 2', 'Feature 3', 'New Feature'],
        description: 'List of features included in the plan',
        isArray: true,
        type: String,
        required: false,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    features?: string[];
}
