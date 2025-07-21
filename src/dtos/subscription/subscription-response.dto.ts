import { ApiProperty } from '@nestjs/swagger';
import { BillingCycle } from '../../../generated/prisma';

export class SubscriptionResponseDto {
    @ApiProperty({
        example: 1,
        description: 'The unique identifier of the subscription',
    })
    id: number;

    @ApiProperty({
        example: true,
        description: 'Whether the subscription is active',
    })
    active: boolean;

    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'The start date of the subscription',
    })
    startDate: Date;

    @ApiProperty({
        example: null,
        description: 'The end date of the subscription (null if active)',
    })
    endDate: Date | null;

    @ApiProperty({
        example: 29.99,
        description: 'The amount paid for the subscription',
    })
    amount: number;

    @ApiProperty({
        example: 5.0,
        description: 'The remaining credit on the subscription',
    })
    remainingCredit: number;

    @ApiProperty({
        description: 'The plan details',
    })
    plan: {
        id: number;
        name: string;
        description: string | null;
        price: number;
        billingCycle: BillingCycle;
        features: string[];
    };

    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'The date and time when the subscription was created',
    })
    createdAt: Date;

    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'The date and time when the subscription was last updated',
    })
    updatedAt: Date;
}
