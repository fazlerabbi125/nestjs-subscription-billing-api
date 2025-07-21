import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { PlanController } from './controllers/plan.controller';
import { SubscriptionController } from './controllers/subscription.controller';
import { PaymentController } from './controllers/payment.controller';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { PlanService } from './services/plan.service';
import { SubscriptionService } from './services/subscription.service';
import { PaymentService } from './services/payment.service';
import { PrismaService } from './services/prisma.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        JwtModule.register({
            global: true,
        }),
    ],
    controllers: [
        AuthController,
        UserController,
        PlanController,
        SubscriptionController,
        PaymentController,
    ],
    providers: [
        AuthService,
        UserService,
        PlanService,
        SubscriptionService,
        PaymentService,
        PrismaService,
    ],
})
export class AppModule {}
