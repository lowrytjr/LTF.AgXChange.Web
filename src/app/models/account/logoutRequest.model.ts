export class LogoutRequest {
    emailAddress: string | undefined;

    constructor(emailAddress: string) {
        this.emailAddress = emailAddress;
    }
}