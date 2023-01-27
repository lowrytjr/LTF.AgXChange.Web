export class LogoutRequest {
    emailAddress: string | undefined;

    constructor(emailAddress: string | undefined) {
        this.emailAddress = emailAddress;
    }
}