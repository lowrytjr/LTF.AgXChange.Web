export class PasswordResetRequestRequest {
    emailAddress: string | undefined;

    constructor(emailAddress: string) {
        this.emailAddress = emailAddress;
    }
}