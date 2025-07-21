import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
    NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionService } from '../services/subscription.service';
import { CreateSubscriptionDto } from '../dtos/subscription/create-subscription.dto';
import { SwitchSubscriptionDto } from '../dtos/subscription/switch-subscription.dto';
import { SubscriptionResponseDto } from '../dtos/subscription/subscription-response.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { MemberGuard } from '../common/guards/member.guard';
import { commonSuccessResponse, SuccessResType } from '../common/success.response';

@ApiTags('Subscriptions')
@Controller('subscriptions')
@UseGuards(AuthGuard, MemberGuard)
@ApiBearerAuth()
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a new subscription',
        description:
            'Subscribe to an active plan. Only one active subscription per user is allowed.',
    })
    @ApiBody({
        type: CreateSubscriptionDto,
        description: 'Subscription creation data',
    })
    @ApiResponse({
        status: 201,
        description: 'Subscription created successfully',
        type: SubscriptionResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid input data or plan not active',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Invalid token',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - User access required',
    })
    @ApiResponse({
        status: 404,
        description: 'Not found - Plan not found',
    })
    @ApiResponse({
        status: 409,
        description: 'Conflict - User already has an active subscription',
    })
    async createSubscription(
        @Body() createSubscriptionDto: CreateSubscriptionDto,
        @Request() req: any,
    ): Promise<SuccessResType<SubscriptionResponseDto>> {
        const subscription = await this.subscriptionService.createSubscription(
            req.user.id,
            createSubscriptionDto,
        );
        return commonSuccessResponse(subscription, 'Subscription created successfully');
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get user subscription',
        description: 'Get the current active subscription for the authenticated user',
    })
    @ApiResponse({
        status: 200,
        description: 'Subscription retrieved successfully',
        type: SubscriptionResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Invalid token',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - User access required',
    })
    @ApiResponse({
        status: 404,
        description: 'Not found - No active subscription found',
    })
    async getUserSubscription(
        @Request() req: any,
    ): Promise<SuccessResType<SubscriptionResponseDto>> {
        const subscription = await this.subscriptionService.getUserSubscription(req.user.id);

        if (!subscription) {
            throw new NotFoundException('No active subscription found');
        }

        return commonSuccessResponse(subscription, 'Subscription retrieved successfully');
    }

    @Patch('cancel')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Cancel subscription',
        description: "Cancel the user's active subscription",
    })
    @ApiResponse({
        status: 200,
        description: 'Subscription cancelled successfully',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Invalid token',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - User access required',
    })
    @ApiResponse({
        status: 404,
        description: 'Not found - No active subscription found',
    })
    async cancelSubscription(@Request() req: any): Promise<SuccessResType<null>> {
        await this.subscriptionService.cancelSubscription(req.user.id);
        return commonSuccessResponse(null, 'Subscription cancelled successfully');
    }

    @Post('switch')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Switch subscription plan',
        description:
            'Switch to a different plan with prorated billing. Current subscription is cancelled and remaining credit is applied to the new plan.',
    })
    @ApiBody({
        type: SwitchSubscriptionDto,
        description: 'Switch subscription data',
    })
    @ApiResponse({
        status: 200,
        description: 'Subscription switched successfully',
        type: SubscriptionResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid input data or new plan not active',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Invalid token',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - User access required',
    })
    @ApiResponse({
        status: 404,
        description: 'Not found - No active subscription or new plan not found',
    })
    async switchSubscription(
        @Body() switchSubscriptionDto: SwitchSubscriptionDto,
        @Request() req: any,
    ): Promise<SuccessResType<SubscriptionResponseDto>> {
        const subscription = await this.subscriptionService.switchSubscription(
            req.user.id,
            switchSubscriptionDto,
        );
        return commonSuccessResponse(subscription, 'Subscription switched successfully');
    }
}
