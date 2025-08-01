import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    UseGuards,
    UseInterceptors,
    Request,
    HttpCode,
    HttpStatus,
    NotFoundException,
} from '@nestjs/common';
import { Request as Req } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dtos/create-subscription.dto';
import { SwitchSubscriptionDto } from './dtos/switch-subscription.dto';
import { SubscriptionResponseDto } from './dtos/subscription-response.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { MemberGuard } from '../common/guards/member.guard';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { User } from '../common/decorators/user.decorator';

@ApiTags('Subscriptions')
@Controller('subscriptions')
@UseGuards(AuthGuard, MemberGuard)
@ApiBearerAuth()
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}

    @Post()
    @UseGuards(AuthGuard, MemberGuard)
    @ApiBearerAuth()
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
    @UseInterceptors(
        new ResponseInterceptor('Subscription created successfully', SubscriptionResponseDto),
    )
    async createSubscription(
        @Body() createSubscriptionDto: CreateSubscriptionDto,
        @User() user: NonNullable<Req['user']>,
    ): Promise<SubscriptionResponseDto> {
        const subscription = await this.subscriptionService.createSubscription(
            user.id,
            createSubscriptionDto,
        );
        return subscription;
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
    @UseInterceptors(
        new ResponseInterceptor('Subscription retrieved successfully', SubscriptionResponseDto),
    )
    async getUserSubscription(@Request() req: any): Promise<SubscriptionResponseDto> {
        const subscription = await this.subscriptionService.getUserSubscription(req.user.id);

        if (!subscription) {
            throw new NotFoundException('No active subscription found');
        }

        return subscription;
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
    @UseInterceptors(new ResponseInterceptor('Subscription cancelled successfully'))
    async cancelSubscription(@Request() req: any): Promise<null> {
        await this.subscriptionService.cancelSubscription(req.user.id);
        return null;
    }

    @Post('switch')
    @UseGuards(AuthGuard, MemberGuard)
    @ApiBearerAuth()
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
    @UseInterceptors(
        new ResponseInterceptor('Subscription switched successfully', SubscriptionResponseDto),
    )
    async switchSubscription(
        @Body() switchSubscriptionDto: SwitchSubscriptionDto,
        @User() user: NonNullable<Req['user']>,
    ): Promise<SubscriptionResponseDto> {
        const subscription = await this.subscriptionService.switchSubscription(
            user.id,
            switchSubscriptionDto,
        );
        return subscription;
    }
}
