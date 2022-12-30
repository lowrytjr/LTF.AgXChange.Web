export class EmailRequest {
    emailAddress: string | undefined;

    constructor(emailAddress: string) {
        this.emailAddress = emailAddress;
    }
}