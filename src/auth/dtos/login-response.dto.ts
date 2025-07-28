import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../user/dtos/user-response.dto';
import { Type } from 'class-transformer';

export class LoginResponseDto {
    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT access token',
    })
    accessToken: string;

    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'JWT refresh token',
    })
    refreshToken: string;

    @ApiProperty({
        description: 'User information',
        type: UserResponseDto,
    })
    @Type(() => UserResponseDto)
    user: UserResponseDto;
}
