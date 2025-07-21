import { ApiProperty } from '@nestjs/swagger';
import { PaymentStatus } from '@/generated/prisma';

export class PaymentResponseDto {
    @ApiProperty({
        example: 1,
        description: 'The unique identifier of the payment',
    })
    id: number;

    @ApiProperty({
        example: 29.99,
        description: 'The payment amount',
    })
    amount: number;

    @ApiProperty({
        example: 'COMPLETED',
        description: 'The payment status',
        enum: PaymentStatus,
    })
    status: PaymentStatus;

    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'The date when payment was made',
    })
    lastPaid: Date | null;

    @ApiProperty({
        description: 'The subscription details',
    })
    subscription: {
        id: number;
        active: boolean;
        startDate: Date;
        endDate: Date | null;
        plan: {
            id: number;
            name: string;
            description: string | null;
            price: number;
            billingCycle: string;
            features: string[];
        };
    };

    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'The date and time when the payment was created',
    })
    createdAt: Date;

    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'The date and time when the payment was last updated',
    })
    updatedAt: Date;
}
