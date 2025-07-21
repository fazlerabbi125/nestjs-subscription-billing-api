import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PaymentResponseDto } from '../dtos/payment/payment-response.dto';

@Injectable()
export class PaymentService {
    constructor(private readonly prisma: PrismaService) {}

    async getUserPayments(userId: number): Promise<PaymentResponseDto[]> {
        try {
            const payments = await this.prisma.payment.findMany({
                where: { userId },
                include: {
                    subscription: {
                        include: {
                            plan: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            return payments.map((payment) => ({
                ...payment,
                amount: Number(payment.amount),
                subscription: {
                    ...payment.subscription,
                    plan: {
                        ...payment.subscription.plan,
                        price: Number(payment.subscription.plan.price),
                    },
                },
            }));
        } catch {
            throw new BadRequestException('Failed to fetch payment history');
        }
    }

    async getPaymentById(userId: number, paymentId: number): Promise<PaymentResponseDto> {
        try {
            const payment = await this.prisma.payment.findFirst({
                where: {
                    id: paymentId,
                    userId,
                },
                include: {
                    subscription: {
                        include: {
                            plan: true,
                        },
                    },
                },
            });

            if (!payment) {
                throw new NotFoundException(`Payment with ID ${paymentId} not found`);
            }

            return {
                ...payment,
                amount: Number(payment.amount),
                subscription: {
                    ...payment.subscription,
                    plan: {
                        ...payment.subscription.plan,
                        price: Number(payment.subscription.plan.price),
                    },
                },
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Failed to fetch payment details');
        }
    }
}
