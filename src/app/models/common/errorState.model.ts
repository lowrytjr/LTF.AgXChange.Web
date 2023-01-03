export class ErrorState {
    statusCode: number = 200;
    message: string | undefined;
    page: string;

    constructor(page: string, statusCode: number, message: string | undefined) {
        this.statusCode = statusCode;
        this.page = page;
        this.message = message;
    }
}