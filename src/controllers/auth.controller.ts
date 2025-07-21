import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/auth/login.dto';
import { LoginResponseDto } from '../dtos/auth/login-response.dto';
import { SuccessResType, commonSuccessResponse } from '../common/success.response';

@ApiTags('Authentication')
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'User login',
        description: 'Authenticate user with email and password',
    })
    @ApiBody({
        type: LoginDto,
        description: 'User login credentials',
    })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        type: LoginResponseDto,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Invalid credentials',
    })
    async login(@Body() loginDto: LoginDto): Promise<SuccessResType<LoginResponseDto>> {
        const result = await this.authService.login(loginDto);
        return commonSuccessResponse(result, 'Login successful');
    }
}
