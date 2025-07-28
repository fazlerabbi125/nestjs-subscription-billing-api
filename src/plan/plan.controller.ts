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
    UseInterceptors,
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
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

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
    @UseInterceptors(
        new ResponseInterceptor('Plans retrieved successfully', PaginatedPlansResponseDto),
    )
    async getAllPlans(
        @Query() query: GetPlansQueryDto,
    ): Promise<PaginatedPlansResponseDto<PlanResponseDto>> {
        const result = await this.planService.getAllPlans(query);
        return result;
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
    @UseInterceptors(new ResponseInterceptor('Plan retrieved successfully', PlanResponseDto))
    async getPlanById(@Param('id', ParseIntPipe) id: number): Promise<PlanResponseDto> {
        const plan = await this.planService.getPlanById(id);
        return plan;
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
    @UseInterceptors(new ResponseInterceptor('Plan created successfully', PlanResponseDto))
    async createPlan(@Body() createPlanDto: CreatePlanDto): Promise<PlanResponseDto> {
        const plan = await this.planService.createPlan(createPlanDto);
        return plan;
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
    @UseInterceptors(new ResponseInterceptor('Plan updated successfully', PlanResponseDto))
    async updatePlan(
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePlanDto: UpdatePlanDto,
    ): Promise<PlanResponseDto> {
        const plan = await this.planService.updatePlan(id, updatePlanDto);
        return plan;
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
    @UseInterceptors(
        new ResponseInterceptor('Plan activation toggled successfully', PlanResponseDto),
    )
    async togglePlanActivation(@Param('id', ParseIntPipe) id: number): Promise<PlanResponseDto> {
        const plan = await this.planService.togglePlanActivation(id);
        return plan;
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
    @UseInterceptors(new ResponseInterceptor('Plan deleted successfully'))
    async deletePlan(@Param('id', ParseIntPipe) id: number): Promise<null> {
        await this.planService.deletePlan(id);
        return null;
    }
}
