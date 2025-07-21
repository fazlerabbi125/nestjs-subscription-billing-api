import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateSubscriptionDto } from '../dtos/subscription/create-subscription.dto';
import { SwitchSubscriptionDto } from '../dtos/subscription/switch-subscription.dto';
import { SubscriptionResponseDto } from '../dtos/subscription/subscription-response.dto';
import { BillingCycle, Plan, Subscription } from '../../generated/prisma';

@Injectable()
export class SubscriptionService {
    constructor(private readonly prisma: PrismaService) {}

    private calculateNextBillingDate(billingCycle: BillingCycle): Date {
        const now = new Date();
        if (billingCycle === BillingCycle.MONTHLY) {
            return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        } else {
            return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
        }
    }

    private calculateProration(
        currentPlan: Plan,
        newPlan: Plan,
        subscription: Subscription,
    ): { proratedAmount: number; remainingCredit: number } {
        const now = new Date();
        const startDate = new Date(subscription.startDate);
        const nextBillingDate = new Date(subscription.nextBillingDate || '');

        // Calculate total days in current billing cycle
        const totalDays = Math.ceil(
            (nextBillingDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        // Calculate remaining days in current billing cycle
        const remainingDays = Math.ceil(
            (nextBillingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );

        // Calculate remaining credit from current plan
        const remainingCredit = (Number(currentPlan.price) * remainingDays) / totalDays;

        // Calculate prorated amount for new plan
        const proratedAmount = Math.max(0, Number(newPlan.price) - remainingCredit);

        return {
            proratedAmount,
            remainingCredit,
        };
    }

    async createSubscription(
        userId: number,
        createSubscriptionDto: CreateSubscriptionDto,
    ): Promise<SubscriptionResponseDto> {
        const { planId } = createSubscriptionDto;

        // Check if user already has an active subscription
        const existingSubscription = await this.prisma.subscription.findFirst({
            where: {
                userId,
                active: true,
            },
        });

        if (existingSubscription) {
            throw new ConflictException('User already has an active subscription');
        }

        // Check if plan exists and is active
        const plan = await this.prisma.plan.findUnique({
            where: { id: planId },
        });

        if (!plan) {
            throw new NotFoundException(`Plan with ID ${planId} not found`);
        }

        if (!plan.active) {
            throw new BadRequestException('Plan is not active');
        }

        const nextBillingDate = this.calculateNextBillingDate(plan.billingCycle);

        try {
            // Create subscription
            const subscription = await this.prisma.subscription.create({
                data: {
                    userId,
                    planId,
                    active: true,
                    startDate: new Date(),
                },
                include: {
                    plan: true,
                },
            });

            // Create payment with nextBillingDate
            const payment = await this.prisma.payment.create({
                data: {
                    userId,
                    subscriptionId: subscription.id,
                    amount: Number(plan.price),
                    status: 'COMPLETED',
                },
            });

            return {
                ...subscription,
                amount: Number(payment.amount),
                remainingCredit: 0,
                plan: {
                    ...subscription.plan,
                    price: Number(subscription.plan.price),
                },
            };
        } catch {
            throw new BadRequestException('Failed to create subscription');
        }
    }

    async getUserSubscription(userId: number): Promise<SubscriptionResponseDto | null> {
        const subscription = await this.prisma.subscription.findFirst({
            where: {
                userId,
                active: true,
            },
            include: {
                plan: true,
                payments: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 1,
                },
            },
        });

        if (!subscription) {
            return null;
        }

        const latestPayment = subscription.payments[0];

        return {
            ...subscription,
            amount: Number(latestPayment?.amount || 0),
            remainingCredit: 0, // Calculate this based on your business logic
            plan: {
                ...subscription.plan,
                price: Number(subscription.plan.price),
            },
        };
    }

    async cancelSubscription(userId: number): Promise<void> {
        const subscription = await this.prisma.subscription.findFirst({
            where: {
                userId,
                active: true,
            },
        });

        if (!subscription) {
            throw new NotFoundException('No active subscription found');
        }

        try {
            await this.prisma.subscription.update({
                where: { id: subscription.id },
                data: {
                    active: false,
                    endDate: new Date(),
                },
            });
        } catch {
            throw new BadRequestException('Failed to cancel subscription');
        }
    }

    async switchSubscription(
        userId: number,
        switchSubscriptionDto: SwitchSubscriptionDto,
    ): Promise<SubscriptionResponseDto> {
        const { newPlanId } = switchSubscriptionDto;

        // Get current active subscription
        const currentSubscription = await this.prisma.subscription.findFirst({
            where: {
                userId,
                active: true,
            },
            include: {
                plan: true,
                payments: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    take: 1,
                },
            },
        });

        if (!currentSubscription) {
            throw new NotFoundException('No active subscription found');
        }

        // Check if new plan exists and is active
        const newPlan = await this.prisma.plan.findUnique({
            where: { id: newPlanId },
        });

        if (!newPlan) {
            throw new NotFoundException(`Plan with ID ${newPlanId} not found`);
        }

        if (!newPlan.active) {
            throw new BadRequestException('New plan is not active');
        }

        // Calculate prorated amount
        const { proratedAmount, remainingCredit } = this.calculateProration(
            currentSubscription.plan,
            newPlan,
            currentSubscription,
        );

        const nextBillingDate = this.calculateNextBillingDate(newPlan.billingCycle);

        try {
            // Use transaction to ensure atomicity
            const result = await this.prisma.$transaction(async (tx) => {
                // Cancel current subscription
                await tx.subscription.update({
                    where: { id: currentSubscription.id },
                    data: {
                        active: false,
                        endDate: new Date(),
                    },
                });

                // Create new subscription
                const newSubscription = await tx.subscription.create({
                    data: {
                        userId,
                        planId: newPlanId,
                        active: true,
                        startDate: new Date(),
                    },
                    include: {
                        plan: true,
                    },
                });

                // Create payment for new subscription
                const payment = await tx.payment.create({
                    data: {
                        userId,
                        subscriptionId: newSubscription.id,
                        amount: proratedAmount > 0 ? proratedAmount : Number(newPlan.price),
                        status: 'COMPLETED',
                    },
                });

                return { subscription: newSubscription, payment, remainingCredit };
            });

            return {
                ...result.subscription,
                amount: Number(result.payment.amount),
                remainingCredit: result.remainingCredit,
                plan: {
                    ...result.subscription.plan,
                    price: Number(result.subscription.plan.price),
                },
            };
        } catch {
            throw new BadRequestException('Failed to switch subscription');
        }
    }
}
