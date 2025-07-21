import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'The email address of the user',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'securePassword123',
        description: 'The password for the user account',
        minLength: 6,
    })
    @IsString()
    @MinLength(6)
    password: string;
}
