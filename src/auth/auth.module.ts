import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@/src/user/user.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [UserModule, PrismaModule],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
