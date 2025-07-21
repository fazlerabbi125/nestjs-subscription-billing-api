import { Controller, HttpCode, HttpStatus, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dtos/login.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { SuccessResponse } from '../common/common-responses';

@ApiTags('Auth')
@Controller()
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

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
    async login(@Body() loginDto: LoginDto): Promise<SuccessResponse<LoginResponseDto>> {
        const { email, password } = loginDto;
        const user = await this.userService.checkCredentials(email, password);
        if (!user) throw new BadRequestException('Invalid credentials');
        const result = await this.authService.login(user);
        return new SuccessResponse(result, 'Login successful');
    }
}
