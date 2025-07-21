import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RegisterUserDto } from '../dtos/user/register-user.dto';
import { UserResponseDto } from '../dtos/user/user-response.dto';
import * as bcrypt from 'bcrypt';
import { Role, User } from '../../generated/prisma';

@Injectable()
export class UserService {
    saltRounds = 10;
    constructor(private readonly prisma: PrismaService) {}

    async checkUserExists(email: string, password: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        return isPasswordValid ? user : null;
    }

    async registerUser(registerUserDto: RegisterUserDto): Promise<UserResponseDto> {
        const { email, password, name, role = Role.USER } = registerUserDto;

        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, this.saltRounds);

        try {
            // Create user
            const user = await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role,
                    name,
                },
            });

            return user;
        } catch (error) {
            throw new BadRequestException('Failed to create user');
        }
    }
}
