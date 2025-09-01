export type ActionResult<T = unknown> = {
    success: true;
    data?: T;
} | {
    error: string;
    success?: false;
};
