import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    ParseIntPipe,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
    ApiBearerAuth,
    ApiQuery,
} from '@nestjs/swagger';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dtos/create-plan.dto';
import { UpdatePlanDto } from './dtos/update-plan.dto';
import { PlanResponseDto } from './dtos/plan-response.dto';
import { GetPlansQueryDto } from './dtos/get-plans-query.dto';
import { PaginatedPlansResponseDto } from './dtos/paginated-plans-response.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { SuccessResponse } from '../common/common-responses';

@ApiTags('Plans')
@Controller('plans')
export class PlanController {
    constructor(private readonly planService: PlanService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get all plans with pagination',
        description:
            'Get all plans with optional filtering by name, billing cycle, and active status. Supports pagination.',
    })
    @ApiQuery({
        name: 'name',
        required: false,
        description: 'Filter plans by name (partial match)',
        example: 'Premium',
    })
    @ApiQuery({
        name: 'billingCycle',
        required: false,
        description: 'Filter plans by billing cycle',
        enum: ['MONTHLY', 'YEARLY'],
    })
    @ApiQuery({
        name: 'active',
        required: false,
        description: 'Filter plans by active status',
        type: 'boolean',
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number (starts from 1)',
        type: 'number',
        example: 1,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Number of items per page (1-100)',
        type: 'number',
        example: 10,
    })
    @ApiResponse({
        status: 200,
        description: 'Plans retrieved successfully with pagination',
        type: PaginatedPlansResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid query parameters',
    })
    async getAllPlans(
        @Query() query: GetPlansQueryDto,
    ): Promise<SuccessResponse<PaginatedPlansResponseDto<PlanResponseDto>>> {
        const result = await this.planService.getAllPlans(query);
        return new SuccessResponse(result, 'Plans retrieved successfully');
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get plan by ID',
        description: 'Get a single plan by its ID',
    })
    @ApiResponse({
        status: 200,
        description: 'Plan retrieved successfully',
        type: PlanResponseDto,
    })
    @ApiResponse({
        status: 404,
        description: 'Not found - Plan not found',
    })
    async getPlanById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<SuccessResponse<PlanResponseDto>> {
        const plan = await this.planService.getPlanById(id);
        return new SuccessResponse(plan, 'Plan retrieved successfully');
    }

    @Post()
    @UseGuards(AuthGuard, AdminGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a new plan',
        description: 'Create a new subscription plan (Admin only)',
    })
    @ApiBody({
        type: CreatePlanDto,
        description: 'Plan creation data',
    })
    @ApiResponse({
        status: 201,
        description: 'Plan successfully created',
        type: PlanResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid input data',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Invalid token',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - Admin access required',
    })
    async createPlan(
        @Body() createPlanDto: CreatePlanDto,
    ): Promise<SuccessResponse<PlanResponseDto>> {
        const plan = await this.planService.createPlan(createPlanDto);
        return new SuccessResponse(plan, 'Plan created successfully');
    }

    @Put(':id')
    @UseGuards(AuthGuard, AdminGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Update an existing plan',
        description: 'Update an existing subscription plan (Admin only)',
    })
    @ApiBody({
        type: UpdatePlanDto,
        description: 'Plan update data',
    })
    @ApiResponse({
        status: 200,
        description: 'Plan successfully updated',
        type: PlanResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid input data',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Invalid token',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - Admin access required',
    })
    @ApiResponse({
        status: 404,
        description: 'Not found - Plan not found',
    })
    async updatePlan(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePlanDto: UpdatePlanDto,
    ): Promise<SuccessResponse<PlanResponseDto>> {
        const plan = await this.planService.updatePlan(id, updatePlanDto);
        return new SuccessResponse(plan, 'Plan updated successfully');
    }

    @Patch(':id/toggle-activation')
    @UseGuards(AuthGuard, AdminGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Toggle plan activation',
        description: 'Toggle the activation status of a subscription plan (Admin only)',
    })
    @ApiResponse({
        status: 200,
        description: 'Plan activation toggled successfully',
        type: PlanResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Invalid token',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - Admin access required',
    })
    @ApiResponse({
        status: 404,
        description: 'Not found - Plan not found',
    })
    async togglePlanActivation(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<SuccessResponse<PlanResponseDto>> {
        const plan = await this.planService.togglePlanActivation(id);
        return new SuccessResponse(plan, 'Plan activation toggled successfully');
    }

    @Delete(':id')
    @UseGuards(AuthGuard, AdminGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Delete a plan',
        description: 'Delete a subscription plan (Admin only)',
    })
    @ApiResponse({
        status: 200,
        description: 'Plan successfully deleted',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Invalid token',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - Admin access required',
    })
    @ApiResponse({
        status: 404,
        description: 'Not found - Plan not found',
    })
    async deletePlan(@Param('id', ParseIntPipe) id: number): Promise<SuccessResponse<null>> {
        await this.planService.deletePlan(id);
        return new SuccessResponse(null, 'Plan deleted successfully');
    }
}
