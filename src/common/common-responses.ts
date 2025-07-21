export class SuccessResponse<T = any> {
    success: boolean;
    message: string;
    result?: T;

    constructor(data: T, message: string = 'Success') {
        this.success = true;
        this.message = message;
        this.result = data;
    }
}

export const errResponse = <T = any>(message: string = 'Failed', errors?: Record<string, any>) => {
    return {
        success: false,
        message,
        errors,
    };
};

export type ErrorResType<T> = ReturnType<typeof errResponse<T>>;
