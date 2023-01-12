export class AuthenticateRequestRequest {
    emailAddress: string | undefined;

    constructor(emailAddress: string) {
        this.emailAddress = emailAddress;
    }
}