import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { LoginDto } from '../dtos/auth/login.dto';
import { LoginResponseDto } from '../dtos/auth/login-response.dto';
import { PrismaService } from './prisma.service';
import { JWT_expiration, JWT_keys } from '@src/common/constants';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
    ) {}

    async login(loginDto: LoginDto): Promise<LoginResponseDto> {
        const { email, password } = loginDto;

        // Find user by email
        const user = await this.userService.checkUserExists(email, password);
        if (!user) {
            throw new BadRequestException('Invalid credentials');
        }

        // Generate JWT token
        const payload = { sub: user.id, role: user.role };
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: JWT_keys.access,
            expiresIn: JWT_expiration.access,
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: JWT_keys.refresh,
            expiresIn: JWT_expiration.refresh,
        });

        // Return user without password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userResponse } = user;

        return {
            accessToken,
            refreshToken,
            user: userResponse,
        };
    }
}
