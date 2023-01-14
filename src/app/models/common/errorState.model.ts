export class ErrorState {
    statusCode: number = 200;
    message: string | undefined;
    link: string | undefined;
    linkText: string | undefined;

    constructor(statusCode: number, message: string | undefined, link: string | undefined, linkText: string | undefined) {
        this.statusCode = statusCode;
        this.message = message;
        this.link = link;
        this.linkText = linkText;
    }
}