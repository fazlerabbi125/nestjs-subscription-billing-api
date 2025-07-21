import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../generated/prisma';

export class UserResponseDto {
    @ApiProperty({
        example: 1,
        description: 'The unique identifier of the user',
    })
    id: number;

    @ApiProperty({
        example: 'John Doe',
        description: 'The name of the user',
    })
    name: string;

    @ApiProperty({
        example: 'john.doe@example.com',
        description: 'The email address of the user',
    })
    email: string;

    @ApiProperty({
        example: 'USER',
        description: 'The role of the user',
        enum: Role,
    })
    role: Role;

    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'The date and time when the user was created',
    })
    createdAt: Date;

    @ApiProperty({
        example: '2023-01-01T00:00:00.000Z',
        description: 'The date and time when the user was last updated',
    })
    updatedAt: Date;
}
