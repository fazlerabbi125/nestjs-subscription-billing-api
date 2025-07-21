import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class MemberGuard implements CanActivate {
    constructor() {}

    canActivate(context: ExecutionContext): boolean {
        const request: Request = context.switchToHttp().getRequest();
        if (request.user?.role !== 'USER') {
            throw new ForbiddenException('You do not have permission to access this resource');
        }
        return true;
    }
}
