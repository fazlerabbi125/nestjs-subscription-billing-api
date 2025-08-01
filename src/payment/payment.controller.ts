import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    UseGuards,
    UseInterceptors,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { PaymentResponseDto } from './dtos/payment-response.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { MemberGuard } from '../common/guards/member.guard';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(AuthGuard, MemberGuard)
@ApiBearerAuth()
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get user payment history',
        description: 'Get billing history for the authenticated user',
    })
    @ApiResponse({
        status: 200,
        description: 'Payment history retrieved successfully',
        type: [PaymentResponseDto],
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Failed to fetch payment history',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Invalid token',
    })
    @ApiResponse({
        status: 403,
        description: 'Forbidden - User access required',
        // For List responses
        // type: [PaymentResponseDto],
        // OR
        // type: PaymentResponseDto,
        // isArray: true,
    })
    @UseInterceptors(new ResponseInterceptor('Payment history retrieved successfully'))
    async getUserPayments(@Request() req: any): Promise<PaymentResponseDto[]> {
        const payments = await this.paymentService.getUserPayments(req.user.id);
        return payments;
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Get payment invoice details',
        description: 'Get detailed invoice information for a specific payment',
    })
    @ApiResponse({
        status: 200,
        description: 'Payment invoice details retrieved successfully',
        type: PaymentResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Failed to fetch payment details',
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
        description: 'Not found - Payment not found',
    })
    @UseInterceptors(
        new ResponseInterceptor(
            'Payment invoice details retrieved successfully',
            PaymentResponseDto,
        ),
    )
    async getPaymentById(
        @Param('id', ParseIntPipe) paymentId: number,
        @Request() req: any,
    ): Promise<PaymentResponseDto> {
        const payment = await this.paymentService.getPaymentById(req.user.id, paymentId);
        return payment;
    }
}
