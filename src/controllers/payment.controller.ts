import {
    Controller,
    Get,
    Param,
    ParseIntPipe,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from '../services/payment.service';
import { PaymentResponseDto } from '../dtos/payment/payment-response.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { MemberGuard } from '../common/guards/member.guard';
import { commonSuccessResponse, SuccessResType } from '../common/success.response';

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
    })
    async getUserPayments(@Request() req: any): Promise<SuccessResType<PaymentResponseDto[]>> {
        const payments = await this.paymentService.getUserPayments(req.user.id);
        return commonSuccessResponse(payments, 'Payment history retrieved successfully');
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
    async getPaymentById(
        @Param('id', ParseIntPipe) paymentId: number,
        @Request() req: any,
    ): Promise<SuccessResType<PaymentResponseDto>> {
        const payment = await this.paymentService.getPaymentById(req.user.id, paymentId);
        return commonSuccessResponse(payment, 'Payment invoice details retrieved successfully');
    }
}
