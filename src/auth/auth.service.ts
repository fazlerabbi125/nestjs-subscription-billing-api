import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/src/user/user.service';
import { LoginDto } from './dtos/login.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { JWT_config } from '@/src/common/constants';
import { User } from '@/generated/prisma';
import { TokenPayload } from '../common/custom-types/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async getToken(payload: Required<TokenPayload>): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret: JWT_config.access.secret,
            expiresIn: JWT_config.access.expiresIn,
        });
    }
    async login(user: User): Promise<LoginResponseDto> {
        const payload = { id: user.id, role: user.role };
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: JWT_config.access.secret,
            expiresIn: JWT_config.access.expiresIn,
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: JWT_config.refresh.secret,
            expiresIn: JWT_config.refresh.expiresIn,
        });

        return {
            accessToken,
            refreshToken,
            user,
        };
    }
}
