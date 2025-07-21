import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserService } from '../services/user.service';
import { RegisterUserDto } from '../dtos/user/register-user.dto';
import { UserResponseDto } from '../dtos/user/user-response.dto';
import { commonSuccessResponse, SuccessResType } from '@src/common/success.response';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Register a new user',
        description: 'Creates a new user account with email and password',
    })
    @ApiBody({
        type: RegisterUserDto,
        description: 'User registration data',
    })
    @ApiResponse({
        status: 201,
        description: 'User successfully created',
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid input data',
    })
    @ApiResponse({
        status: 409,
        description: 'Conflict - User with this email already exists',
    })
    async registerUser(
        @Body() registerUserDto: RegisterUserDto,
    ): Promise<SuccessResType<UserResponseDto>> {
        const user = await this.userService.registerUser(registerUserDto);
        return commonSuccessResponse(user, 'User successfully registered');
    }
}
