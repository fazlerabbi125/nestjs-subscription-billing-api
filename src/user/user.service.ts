import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/src/prisma/prisma.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import * as bcrypt from 'bcrypt';
import { Role, User } from '@/generated/prisma';

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async checkCredentials(email: string, password: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) return null;

        const isPasswordValid = await bcrypt.compare(password, user.password);
        return isPasswordValid ? user : null;
    }

    async registerUser(registerUserDto: RegisterUserDto): Promise<UserResponseDto> {
        const { email, password, name, role = Role.USER } = registerUserDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) throw new BadRequestException('User with this email already exists');
        try {
            // Hash password
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            // Create user
            const user = await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    role,
                    name,
                },
                omit: {
                    password: true,
                },
            });

            return user;
        } catch {
            throw new BadRequestException('Failed to create user');
        }
    }
}
