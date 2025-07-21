import * as ms from 'ms';

export const JWT_config = {
    access: {
        secret: process.env.JWT_ACCESS_SECRET_KEY ?? '',
        expiresIn: process.env.JWT_ACCESS_EXPIRATION ?? '',
    },
    refresh: {
        secret: process.env.JWT_REFRESH_SECRET_KEY ?? '',
        expiresIn: ms(process.env.JWT_REFRESH_EXPIRATION as ms.StringValue) ?? '',
    },
};

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
    MIN_PAGE: 1,
    MIN_LIMIT: 1,
} as const;
