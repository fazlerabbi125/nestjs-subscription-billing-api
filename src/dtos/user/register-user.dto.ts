import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../../generated/prisma';

export class RegisterUserDto {
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

    @ApiProperty({
        example: 'USER',
        description: 'The role of the user',
        enum: Role,
        default: Role.USER,
        required: false,
    })
    @IsOptional()
    @IsEnum(Role)
    role?: Role;

    @ApiProperty({
        example: 'John Doe',
        description: 'The name of the user',
    })
    @IsString()
    @MinLength(2)
    name: string;
}
