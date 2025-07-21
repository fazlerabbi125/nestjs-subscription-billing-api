import { ApiProperty } from '@nestjs/swagger';
import { BillingCycle } from '../../../generated/prisma';

export class PlanResponseDto {
    @ApiProperty({
        example: 1,
        description: 'The unique identifier of the plan',
    })
    id: number;

    @ApiProperty({
        example: 'Premium Plan',
        description: 'The name of the plan',
    })
    name: string;

    @ApiProperty({
        example: 'Premium plan with advanced features',
        description: 'The description of the plan',
    })
    description: string | null;

    @ApiProperty({
        example: 29.99,
        description: 'The price of the plan',
    })
    price: number;

    @ApiProperty({
        example: true,
        description: 'Whether the plan is active',
    })
    active: boolean;

    @ApiProperty({
        example: 'MONTHLY',
        description: 'The billing cycle of the plan',
        enum: BillingCycle,
    })
    billingCycle: BillingCycle;

    @ApiProperty({
        example: ['Feature 1', 'Feature 2', 'Feature 3'],
        description: 'List of features included in the plan',
        isArray: true,
        type: String,
    })
    features: string[];

    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'The date and time when the plan was created',
    })
    createdAt: Date;

    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'The date and time when the plan was last updated',
    })
    updatedAt: Date;
}
