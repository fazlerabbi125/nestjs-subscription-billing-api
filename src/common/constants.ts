export const JWT_keys = {
    access: process.env.JWT_ACCESS_SECRET_KEY || '',
    refresh: process.env.JWT_REFRESH_SECRET_KEY || '',
};

export const JWT_expiration = {
    access: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refresh: process.env.JWT_REFRESH_EXPIRATION || '7d',
};

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
    MIN_PAGE: 1,
    MIN_LIMIT: 1,
} as const;
