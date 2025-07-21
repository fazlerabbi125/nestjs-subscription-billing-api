import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { BillingCycle } from '../../../generated/prisma';
import { PAGINATION } from '../../common/constants';

export class GetPlansQueryDto {
    @ApiProperty({
        example: 'Premium',
        description: 'Filter plans by name (partial match)',
        required: false,
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        example: 'MONTHLY',
        description: 'Filter plans by billing cycle',
        enum: BillingCycle,
        required: false,
    })
    @IsOptional()
    @IsEnum(BillingCycle)
    billingCycle?: BillingCycle;

    @ApiProperty({
        example: true,
        description: 'Filter plans by active status',
        required: false,
    })
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        return false;
    })
    @IsBoolean()
    active?: boolean;

    @ApiProperty({
        example: PAGINATION.DEFAULT_PAGE,
        description: 'Page number (starts from 1)',
        required: false,
        minimum: PAGINATION.MIN_PAGE,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(PAGINATION.MIN_PAGE)
    page?: number = PAGINATION.DEFAULT_PAGE;

    @ApiProperty({
        example: PAGINATION.DEFAULT_LIMIT,
        description: 'Number of items per page',
        required: false,
        minimum: PAGINATION.MIN_LIMIT,
        maximum: PAGINATION.MAX_LIMIT,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(PAGINATION.MIN_LIMIT)
    @Max(PAGINATION.MAX_LIMIT)
    limit?: number = PAGINATION.DEFAULT_LIMIT;
}
