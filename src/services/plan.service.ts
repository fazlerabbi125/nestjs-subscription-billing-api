import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreatePlanDto } from '../dtos/plan/create-plan.dto';
import { UpdatePlanDto } from '../dtos/plan/update-plan.dto';
import { PlanResponseDto } from '../dtos/plan/plan-response.dto';
import { GetPlansQueryDto } from '../dtos/plan/get-plans-query.dto';
import {
    PaginatedPlansResponseDto,
    PaginationMetaDto,
} from '../dtos/plan/paginated-plans-response.dto';
import { PAGINATION } from '../common/constants';

@Injectable()
export class PlanService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllPlans(
        query: GetPlansQueryDto,
    ): Promise<PaginatedPlansResponseDto<PlanResponseDto>> {
        const {
            name,
            billingCycle,
            active,
            page = PAGINATION.DEFAULT_PAGE,
            limit = PAGINATION.DEFAULT_LIMIT,
        } = query;

        const whereClause: any = {};

        if (name) {
            whereClause.name = {
                contains: name,
                mode: 'insensitive',
            };
        }

        if (billingCycle) {
            whereClause.billingCycle = billingCycle;
        }

        if (active !== undefined) {
            whereClause.active = active;
        }

        const skip = (page - PAGINATION.MIN_PAGE) * limit;

        try {
            const [plans, totalItems] = await Promise.all([
                this.prisma.plan.findMany({
                    where: whereClause,
                    orderBy: {
                        createdAt: 'desc',
                    },
                    skip,
                    take: limit,
                }),
                this.prisma.plan.count({
                    where: whereClause,
                }),
            ]);

            const totalPages = Math.ceil(totalItems / limit);
            const hasNextPage = page < totalPages;
            const hasPreviousPage = page > PAGINATION.MIN_PAGE;

            const paginationMeta: PaginationMetaDto = {
                page,
                limit,
                totalItems,
                totalPages,
                hasNextPage,
                hasPreviousPage,
            };

            const plansWithNumberPrice = plans.map((plan) => ({
                ...plan,
                price: Number(plan.price),
            }));

            return {
                data: plansWithNumberPrice,
                pagination: paginationMeta,
            };
        } catch {
            throw new BadRequestException('Failed to fetch plans');
        }
    }

    async getPlanById(id: number): Promise<PlanResponseDto> {
        try {
            const plan = await this.prisma.plan.findUnique({
                where: { id },
            });

            if (!plan) {
                throw new NotFoundException(`Plan with ID ${id} not found`);
            }

            return {
                ...plan,
                price: Number(plan.price),
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Failed to fetch plan');
        }
    }

    async createPlan(createPlanDto: CreatePlanDto): Promise<PlanResponseDto> {
        try {
            const plan = await this.prisma.plan.create({
                data: {
                    name: createPlanDto.name,
                    description: createPlanDto.description,
                    price: createPlanDto.price,
                    active: createPlanDto.active ?? true,
                    billingCycle: createPlanDto.billingCycle,
                    features: createPlanDto.features,
                },
            });

            return {
                ...plan,
                price: Number(plan.price),
            };
        } catch {
            throw new BadRequestException('Failed to create plan');
        }
    }

    async updatePlan(id: number, updatePlanDto: UpdatePlanDto): Promise<PlanResponseDto> {
        // Check if plan exists
        const existingPlan = await this.prisma.plan.findUnique({
            where: { id },
        });

        if (!existingPlan) {
            throw new NotFoundException(`Plan with ID ${id} not found`);
        }

        try {
            const updatedPlan = await this.prisma.plan.update({
                where: { id },
                data: {
                    name: updatePlanDto.name,
                    description: updatePlanDto.description,
                    price: updatePlanDto.price,
                    active: updatePlanDto.active,
                    billingCycle: updatePlanDto.billingCycle,
                    features: updatePlanDto.features,
                },
            });

            return {
                ...updatedPlan,
                price: Number(updatedPlan.price),
            };
        } catch {
            throw new BadRequestException('Failed to update plan');
        }
    }

    async togglePlanActivation(id: number): Promise<PlanResponseDto> {
        // Check if plan exists
        const existingPlan = await this.prisma.plan.findUnique({
            where: { id },
        });

        if (!existingPlan) {
            throw new NotFoundException(`Plan with ID ${id} not found`);
        }

        try {
            const updatedPlan = await this.prisma.plan.update({
                where: { id },
                data: {
                    active: !existingPlan.active,
                },
            });

            return {
                ...updatedPlan,
                price: Number(updatedPlan.price),
            };
        } catch {
            throw new BadRequestException('Failed to toggle plan activation');
        }
    }

    async deletePlan(id: number): Promise<void> {
        // Check if plan exists
        const existingPlan = await this.prisma.plan.findUnique({
            where: { id },
        });

        if (!existingPlan) {
            throw new NotFoundException(`Plan with ID ${id} not found`);
        }

        try {
            await this.prisma.plan.delete({
                where: { id },
            });
        } catch {
            throw new BadRequestException('Failed to delete plan');
        }
    }
}
