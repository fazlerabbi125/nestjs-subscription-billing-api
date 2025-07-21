import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
    @ApiProperty({
        example: 1,
        description: 'Current page number',
    })
    page: number;

    @ApiProperty({
        example: 10,
        description: 'Number of items per page',
    })
    limit: number;

    @ApiProperty({
        example: 100,
        description: 'Total number of items',
    })
    totalItems: number;

    @ApiProperty({
        example: 10,
        description: 'Total number of pages',
    })
    totalPages: number;

    @ApiProperty({
        example: true,
        description: 'Whether there is a next page',
    })
    hasNextPage: boolean;

    @ApiProperty({
        example: false,
        description: 'Whether there is a previous page',
    })
    hasPreviousPage: boolean;
}

export class PaginatedPlansResponseDto<T> {
    @ApiProperty({
        description: 'Array of items',
        isArray: true,
    })
    data: T[];

    @ApiProperty({
        description: 'Pagination metadata',
        type: PaginationMetaDto,
    })
    pagination: PaginationMetaDto;
}
