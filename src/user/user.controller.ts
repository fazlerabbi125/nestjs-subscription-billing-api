import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { SuccessResponse } from '@/src/common/common-responses';

@ApiTags('Users') // Not mandatory; uses the first part of the controller class name
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        // Gives info about the operation
        summary: 'Register a new user',
        description: 'Creates a new user account with email and password',
    })
    @ApiBody({
        // Not mandatory; can be detected when DTO with Swagger decorators are used on request body
        type: RegisterUserDto,
        description: 'User registration data',
    })
    @ApiResponse({
        /** specifies response type according to status code
         * Each Response also has its own Swagger response decorator
         */
        status: HttpStatus.CREATED,
        description: 'User successfully created',
    })
    @ApiResponse({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        description: 'Bad request - Invalid input data',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Bad request - User with this email already exists',
    })
    async registerUser(
        @Body() registerUserDto: RegisterUserDto,
    ): Promise<SuccessResponse<UserResponseDto>> {
        const user = await this.userService.registerUser(registerUserDto);
        return new SuccessResponse(user, 'User successfully registered');
    }
}
