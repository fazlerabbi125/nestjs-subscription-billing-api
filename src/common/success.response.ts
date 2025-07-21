export const commonSuccessResponse = <T = any>(data: T, message: string = 'Success') => {
    return {
        success: true,
        message,
        result: data,
    };
};

export type SuccessResType<T> = ReturnType<typeof commonSuccessResponse<T>>;
